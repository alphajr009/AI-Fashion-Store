import os
import numpy as np
import pandas as pd
import cv2
import dlib
from sklearn.cluster import KMeans
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color

# Configuration
skin_tones_dir = "images/"
output_dataset = "fashion.csv"

# Updated color mapping
color_mapping = {
    "Red": "#FF0000",
    "Green": "#008000",
    "Yellow": "#FFFF00",
    "Blue": "#0000FF",
    "Purple": "#800080",
    "Pink": "#FFC0CB",
    "Orange": "#FFA500",
    "Brown": "#A52A2A",
    "Grey": "#808080",
    "Black": "#000000",
    "White": "#FFFFFF"
}

# Skin color categories and their color codes
skin_colors = {
    "Fair": "#e9be9f",
    "Olive": "#e6b085",
    "Light Brown": "#a96b4e",
    "Brown": "#7e401e",
    "Black Brown": "#482f21"
}

def preprocess_image(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def get_average_skin_color(img_path):
    img = preprocess_image(img_path)

    face_detector = dlib.get_frontal_face_detector()
    faces = face_detector(img, 1)

    if len(faces) == 0:
        print(f"No face detected in {img_path}")
        return None

    x, y, w, h = faces[0].left(), faces[0].top(), faces[0].width(), faces[0].height()
    img_face = img[y:y+h, x:x+w]

    if img_face.size == 0:
        print(f"Empty face region in {img_path}")
        return None

    img_lab = cv2.cvtColor(img_face, cv2.COLOR_RGB2LAB)

    a_values = img_lab[:, :, 1].flatten()
    b_values = img_lab[:, :, 2].flatten()

    a_median = np.median(a_values)
    b_median = np.median(b_values)

    lower = np.array([0, a_median - 50, b_median - 50])
    upper = np.array([255, a_median + 50, b_median + 50])

    mask = cv2.inRange(img_lab, lower, upper)
    skin_pixels = cv2.bitwise_and(img_face, img_face, mask=mask)
    skin_pixels = skin_pixels.reshape(-1, 3)

    if len(skin_pixels) == 0:
        print(f"No skin pixels detected in {img_path}")
        return None

    kmeans = KMeans(n_clusters=1)
    kmeans.fit(skin_pixels)
    dominant_skin_color = kmeans.cluster_centers_[0].astype(int)

    return sRGBColor(*dominant_skin_color, is_upscaled=True)

def get_matching_colors(skin_color):
    skin_color_lab = convert_color(skin_color, LabColor)
    color_list_lab = [convert_color(sRGBColor.new_from_rgb_hex(color_mapping[hex_code]), LabColor) for hex_code in color_mapping.keys()]

    matching_colors = []

    if skin_color_lab.lab_l > 50:
        matching_colors.extend(["Blue", "Brown", "Red", "Green", "Orange", "Black"])
    else:
        matching_colors.extend(["Red", "Orange", "Purple", "Green", "Blue"])

    for color_lab in color_list_lab:
        delta_e = delta_e_cie2000(skin_color_lab, color_lab)
        if delta_e < 20:
            matching_colors.append(convert_color(color_lab, sRGBColor).get_rgb_hex())

    return matching_colors[:5]

def delta_e_cie2000(color1, color2, kL=1, kC=1, kH=1):
    delta_L = color2.lab_l - color1.lab_l
    delta_a = color2.lab_a - color1.lab_a
    delta_b = color2.lab_b - color1.lab_b

    C1 = np.sqrt(color1.lab_a ** 2 + color1.lab_b ** 2)
    C2 = np.sqrt(color2.lab_a ** 2 + color2.lab_b ** 2)

    mean_C = (C1 + C2) / 2

    phi = np.arctan2(color1.lab_b, color1.lab_a)

    if phi < 0:
        phi += 2 * np.pi

    C1_C2 = C1 * C2
    mean_C2 = mean_C ** 7
    sin_phi = np.sin(phi)
    cos_phi = np.cos(phi)

    delta_L_term = delta_L / (kL * 1)
    delta_C_term = (delta_a ** 2 + delta_b ** 2 - delta_L_term ** 2) ** 0.5
    delta_h_term = np.sqrt(np.maximum(0, delta_a ** 2 + delta_b ** 2 - delta_L_term ** 2))

    delta_E = np.sqrt(delta_L_term ** 2 + delta_C_term ** 2 + delta_h_term ** 2)

    return np.squeeze(delta_E)

data = []

for img_file in os.listdir(skin_tones_dir)[:1000]:
    img_path = os.path.join(skin_tones_dir, img_file)
    skin_color = get_average_skin_color(img_path)

    if skin_color is not None:
        skin_color_hex = skin_color.get_rgb_hex()

        if skin_color_hex is np.nan:
            print(f"Image {img_file}: Invalid skin color detected")
            continue

        matching_colors = get_matching_colors(skin_color)
        skin_type = min(skin_colors.keys(), key=lambda x: abs(int(skin_colors[x][1:], 16) - int(skin_color_hex[1:], 16)))

        data.append({
            "Skin_Color_Hex": skin_color_hex,
            "Matching_Colors": ",".join(matching_colors),
            "Skin_Type": skin_type
        })
    else:
        print(f"Image {img_file}: No face detected or invalid skin color detected")

df = pd.DataFrame(data)
df.to_csv(output_dataset, index=False)
