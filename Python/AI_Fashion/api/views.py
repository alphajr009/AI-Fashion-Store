import os
import cv2
import numpy as np
import json
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from sklearn.cluster import KMeans


# Helper functions for color conversions
def rgb_to_hex(rgb_tuple):
  return "#{:02x}{:02x}{:02x}".format(*rgb_tuple)


def hex_to_rgb(hex_code):
  if pd.isna(hex_code): # Check if hex_code is NaN
    return [0, 0, 0] # Return default RGB values or handle as per your requirement

  hex_code = str(hex_code) # Convert to string to ensure it can be stripped
  hex_code = hex_code.lstrip("#")
  return [int(hex_code[i:i + 2], 16) for i in (0, 2, 4)]


def rgb_list_to_array(rgb_list):
  return np.array(rgb_list)

def find_matching_colors(skin_color_hex, fashion_data, n_neighbors=5):
  skin_color_rgb = np.array([hex_to_rgb(skin_color_hex)])
  data = fashion_data.copy()
  data['Skin_Color_RGB'] = data['Skin_Color_Hex'].apply(hex_to_rgb).apply(rgb_list_to_array)
  le = LabelEncoder()
  data['Type_Encoded'] = le.fit_transform(data['Type'])
  X = np.array(data['Skin_Color_RGB'].tolist())
  y = data['Type_Encoded']
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
  model = KNeighborsClassifier(n_neighbors=n_neighbors)
  model.fit(X_train, y_train)
  skin_color_pred = model.predict(skin_color_rgb)
  matching_type_encoded = skin_color_pred[0]
  matching_type = le.inverse_transform([matching_type_encoded])[0]
  matching_colors = data[data['Type'] == matching_type]['Matching_Colors'].values[0].split(', ')
  return {
    'matching_colors': matching_colors,
    'Skin_Color_Hex': skin_color_hex,
    'Type': matching_type
  }

@csrf_exempt
def analyze_image(request):
  if request.method == 'POST':
    data = json.loads(request.body.decode('utf-8'))
    token_id = data.get('tokenID')
    print(f"Token ID is: {token_id}")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(base_dir, '..', '..', '..', 'tokens', f'{token_id}.jpg')

    print(f"Checking for image at path: {image_path}")

    if os.path.exists(image_path):
      print(f"Image found at path: {image_path}")

      img = cv2.imread(image_path)
      img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
      img = gray_world(img)

      face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
      faces = face_cascade.detectMultiScale(img, 1.3, 5)

      if len(faces) > 0:
        x, y, w, h = faces[0]
        img_face = img[y:y+h, x:x+w]
        skin_color_hex = analyze_skin_color(img_face)


        fashion_data_path = os.path.join(base_dir, '..', 'fashion.csv')
        fashion_data = pd.read_csv(fashion_data_path)

        # Get matching colors
        response_data = find_matching_colors(skin_color_hex, fashion_data)

        return JsonResponse(response_data)

      else:
        print("Face not found")
        return JsonResponse({'error': 'Face not found'}, status=400)

    else:
      print("Image not found")
      return JsonResponse({'error': 'Token ID not found'}, status=404)

def gray_world(img):
  b, g, r = cv2.split(img)
  b_avg, g_avg, r_avg = np.mean(b), np.mean(g), np.mean(r)
  avg = (b_avg + g_avg + r_avg) / 3
  b_corrected = np.clip(b * (avg / b_avg), 0, 255).astype(np.uint8)
  g_corrected = np.clip(g * (avg / g_avg), 0, 255).astype(np.uint8)
  r_corrected = np.clip(r * (avg / r_avg), 0, 255).astype(np.uint8)
  return cv2.merge([b_corrected, g_corrected, r_corrected])

def analyze_skin_color(img_face):
  img_hsv = cv2.cvtColor(img_face, cv2.COLOR_RGB2HSV)
  h_values = img_hsv[:, :, 0].flatten()
  s_values = img_hsv[:, :, 1].flatten()
  v_values = img_hsv[:, :, 2].flatten()
  h_median = np.median(h_values)
  s_median = np.median(s_values)
  v_median = np.median(v_values)
  lower = np.array([h_median - 15, s_median - 50, v_median - 50])
  upper = np.array([h_median + 15, s_median + 50, v_median + 50])
  mask = cv2.inRange(img_hsv, lower, upper)
  skin_pixels = cv2.bitwise_and(img_face, img_face, mask=mask)
  skin_pixels = skin_pixels.reshape(-1, 3)
  skin_color_hex = get_dominant_skin_color(skin_pixels)
  return skin_color_hex

def get_dominant_skin_color(skin_pixels):
  kmeans = KMeans(n_clusters=2, init='k-means++')
  kmeans.fit(skin_pixels)
  skin_color = kmeans.cluster_centers_[1].astype(int)
  skin_color_hex = "#{:02x}{:02x}{:02x}".format(*skin_color)
  return skin_color_hex