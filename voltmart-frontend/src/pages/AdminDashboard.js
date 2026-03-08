import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

  const [products, setProducts] = useState([]);

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [brand,setBrand] = useState("");
  const [price,setPrice] = useState("");
  const [stock,setStock] = useState("");

  // Load products
  const loadData = async () => {
  try {

    const products = await productsApi.list();

    setProducts(products.data);

  } catch (error) {

    console.error("Failed to load dashboard data", error);

  }
};

  useEffect(()=>{
    loadData();
  },[]);


  // Add product
  const addProduct = async () => {

    if(!name || !price || !stock){
      alert("Please fill required fields");
      return;
    }

    await API.post("/products",{
      name,
      category,
      brand,
      price,
      stock
    });

    setName("");
    setCategory("");
    setBrand("");
    setPrice("");
    setStock("");

    loadProducts();

  };


  // Delete product
  const deleteProduct = async (id) => {

    if(window.confirm("Delete this product?")){
      await API.delete("/products/"+id);
      loadProducts();
    }

  };


  // Low stock alert
  const showLowStock = async () => {

    const response = await API.get("/products/low-stock");

    setProducts(response.data);

  };


  return (

    <div className="dashboard">

      <h1 className="title">VoltMart Admin Dashboard</h1>

      {/* Add Product */}

      <div className="card">

        <h2>Add Product</h2>

        <div className="form">

          <input
          placeholder="Product Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />

          <input
          placeholder="Category"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          />

          <input
          placeholder="Brand"
          value={brand}
          onChange={(e)=>setBrand(e.target.value)}
          />

          <input
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          />

          <input
          placeholder="Stock"
          value={stock}
          onChange={(e)=>setStock(e.target.value)}
          />

          <button className="addBtn" onClick={addProduct}>
            Add Product
          </button>

        </div>

      </div>


      {/* Actions */}

      <div className="actions">

        <button className="lowStockBtn" onClick={showLowStock}>
          Show Low Stock
        </button>

        <button className="reloadBtn" onClick={loadProducts}>
          Show All Products
        </button>

      </div>


      {/* Product Table */}

      <div className="tableCard">

        <h2>Products</h2>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {products.map((p)=>(

              <tr key={p.id}
              className={p.stock < 5 ? "lowStockRow" : ""}>

                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                <td>
                  <button
                  className="deleteBtn"
                  onClick={()=>deleteProduct(p.id)}>
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminDashboard;