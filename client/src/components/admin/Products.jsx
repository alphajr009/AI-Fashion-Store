import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admin.css";
import { Input, Form, Button, Modal, notification, Select, Table } from "antd";
import ImageUploader from "../ImageUploader";

function Products() {
  const { Option } = Select;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible1, setIsModalVisible1] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [imageurls, setImageurls] = useState(Array(4).fill(""));

  const onImageUpload = (index, imageFile) => {
    setImageurls((prevImageurls) => {
      const newImageurls = [...prevImageurls];
      newImageurls[index] = imageFile;
      console.log(`Image at index ${index}:`, imageFile);
      return newImageurls;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/getallproducts");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await axios.patch("/api/product/deleteproduct", {
        _id: selectedProduct._id,
      });
      notification.success({
        message: "Success",
        description: response.data,
      });
      fetchProducts();
      setIsModalVisible1(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="link" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  const showDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setIsModalVisible1(true);
  };

  const types = [
    "Dresses",
    "Tops",
    "TShirts",
    "Pants",
    "Skirts",
    "Jeans",
    "Shorts",
    "JumpSuits",
    "Jackets",
  ];

  const colors = [
    "Red",
    "Green",
    "Yellow",
    "Purple",
    "Black",
    "White",
    "Orange",
    "Grey",
    "Blue",
    "Pink",
    "Brown",
  ];

  const occasion = [
    "Casual",
    "Formal",
    "Date Night",
    "Beach",
    "Sport",
    "Vacation",
    "Party",
    "Wedding",
    "Gym",
  ];

  const ageGroups = ["13-19", "20-35", "36-55", "56+"];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    createproduct();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setName("");
    setPrice("");
    setDescription("");
    setSelectedType("");
    setSelectedColor("");
    setSelectedOccasion("");
    setSelectedAge("");
    setImageurls(Array(4).fill(""));
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleOccasionChange = (value) => {
    setSelectedOccasion(value);
  };

  const handleAgeChange = (value) => {
    setSelectedAge(value);
  };

  const handleColorChange = (value) => {
    setSelectedColor(value);
  };

  async function createproduct() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("color", selectedColor);
    formData.append("type", selectedType);
    formData.append("occasion", selectedOccasion);
    formData.append("age", selectedAge);

    imageurls.forEach((image, index) => {
      if (image) {
        formData.append("images", image, `${user._id}-${index}.jpg`);
      }
    });

    console.log("imageurls:", imageurls);

    try {
      const response = await axios.post("/api/product/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.status);

      notification.success({
        message: "Success",
        description: "Product Added Successfully!",
      });

      setTimeout(() => {
        window.location.href = "/admin-terminal";
      }, 1500);
    } catch (error) {
      if (error.response) {
        console.log("Error1:");
      } else {
        console.log("Error2:");
      }
    }
  }

  return (
    <div className="products">
      <div className="products-header">
        <div className="ph-header">
          <h3>Products</h3>
        </div>
        <div className="ph-btn">
          <Button onClick={showModal}>Create Product</Button>
        </div>
      </div>

      <div className="product-table">
        <Table dataSource={products} columns={columns} rowKey="_id" />
      </div>
      <Modal
        title="Delete Product"
        visible={isModalVisible1}
        onOk={deleteProduct}
        onCancel={() => setIsModalVisible1(false)}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={650}
      >
        <div className="product-modal">
          <div className="crb-s2-header">
            <h5>Upload product images:</h5>
          </div>
          <br />
          <div className="crb-s2-images-upload">
            <div className="scrb-s2-iu-wrapper">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <ImageUploader
                    key={index}
                    index={index}
                    onImageUpload={onImageUpload}
                  />
                ))}
            </div>
          </div>

          <br />
          <br />

          <Form>
            <div className="">
              <div className="categort-align">
                <Form.Item
                  className="-conatiner-p"
                  label="Type:"
                  name="type"
                  rules={[
                    { required: true, message: "Please input product Type!" },
                  ]}
                >
                  <Select
                    className="createblog-category-select"
                    placeholder="Category"
                    style={{ width: "175px", marginLeft: "30px" }}
                    value={selectedType}
                    onChange={handleTypeChange}
                  >
                    {types.map((category) => (
                      <Option key={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="categort-align">
                <Form.Item
                  className="-conatiner-p"
                  label="Occasion:"
                  name="occasion"
                  rules={[
                    {
                      required: true,
                      message: "Please input product occasion!",
                    },
                  ]}
                >
                  <Select
                    className="createblog-category-select"
                    placeholder="Occasion"
                    style={{ width: "175px", marginLeft: "30px" }}
                    value={selectedOccasion}
                    onChange={handleOccasionChange}
                  >
                    {occasion.map((category) => (
                      <Option key={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="categort-align">
                <Form.Item
                  className="-conatiner-p"
                  label="Color:"
                  name="color"
                  rules={[
                    { required: true, message: "Please input product Color!" },
                  ]}
                >
                  <Select
                    className="createblog-category-select"
                    placeholder="Color"
                    style={{ width: "175px", marginLeft: "30px" }}
                    value={selectedColor}
                    onChange={handleColorChange}
                  >
                    {colors.map((category) => (
                      <Option key={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="categort-align">
                <Form.Item
                  className="-conatiner-p"
                  label="Age:"
                  name="age"
                  rules={[
                    {
                      required: true,
                      message: "Please input product Age Group!",
                    },
                  ]}
                >
                  <Select
                    className="createblog-category-select"
                    placeholder="Age Group"
                    style={{ width: "175px", marginLeft: "30px" }}
                    value={selectedAge}
                    onChange={handleAgeChange}
                  >
                    {ageGroups.map((category) => (
                      <Option key={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="align-set">
                <div className="aligh-items-cplaces">
                  <div className="-container">
                    <Form.Item
                      className="-conatiner-p"
                      label="Name:"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input product Name!",
                        },
                      ]}
                    >
                      <Input
                        className="createblog-dis-custom-input"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        maxLength={85}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="userp-help-messagebox">
                  <div className="userp-help-namebox-container">
                    <Form.Item
                      className="userp-help-namebox-conatiner-p"
                      label="Description :"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Please input your product description!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        style={{ height: "245px", width: "626px" }}
                        maxLength={1300}
                        className="userp-helpmsg-custom-input"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="-container">
                  <Form.Item
                    className="-conatiner-p"
                    label="Price:"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Product Price!",
                      },
                    ]}
                  >
                    <Input
                      className="createblog-dis-custom-input "
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      maxLength={85}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
