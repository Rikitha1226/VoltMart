import { useState } from "react";
import { ordersApi, productsApi } from "../api/api";
import "../styles/billing.css";

function CashierDashboard() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");


  // -----------------------------
  // LIVE SEARCH PRODUCTS
  // -----------------------------
  const searchProduct = async (text) => {

    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {

      const response = await productsApi.searchByName(text);

      setResults(response.data || []);

    } catch (error) {

      console.error("Product search failed:", error);

    }

  };


  // -----------------------------
  // ADD PRODUCT TO CART
  // -----------------------------
  const addToCart = (product) => {

    const existing = cart.find(
      (item) => item.productId === product.id
    );

    if (existing) {

      if (existing.quantity >= product.stock) {
        alert("Stock limit reached");
        return;
      }

      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: 1
        }
      ]);

    }

  };


  // -----------------------------
  // INCREASE QUANTITY
  // -----------------------------
  const increaseQty = (id) => {

    setCart(
      cart.map((item) => {

        if (item.productId === id) {

          if (item.quantity >= item.stock) {
            alert("Stock limit reached");
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1
          };

        }

        return item;

      })
    );

  };


  // -----------------------------
  // DECREASE QUANTITY
  // -----------------------------
  const decreaseQty = (id) => {

    setCart(
      cart
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeItem = (id) => {

    setCart(
      cart.filter((item) => item.productId !== id)
    );

  };


  // -----------------------------
  // BILL TOTAL
  // -----------------------------
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  // -----------------------------
  // GENERATE ORDER
  // -----------------------------
  const generateOrder = async () => {

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!customerPhone || customerPhone.length < 10) {
      alert("Enter valid customer phone number");
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const payload = {
      customerPhone: customerPhone,
      items: items
    };

    console.log("Order payload:", payload);

    try {

      await ordersApi.create(customerPhone, items);

      alert("Order placed successfully");

      setCart([]);
      setCustomerPhone("");
      setShowCustomerModal(false);

    } catch (error) {

      console.error("Order failed:", error);
      alert("Order failed");

    }

  };


  return (

    <div className="cashier">

      <h1 className="title">VoltMart Billing</h1>


      {/* ---------------- SEARCH ---------------- */}

      <div className="searchBox">

        <input
          type="text"
          placeholder="Search product name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchProduct(e.target.value);
          }}
        />

      </div>


      {/* ---------------- PRODUCTS ---------------- */}

      <div className="results">

        {results.map((p) => (

          <div key={p.id} className="productCard">

            <h3>{p.name}</h3>

            <p className="brand">{p.brand}</p>

            <p className="price">₹{p.price}</p>

            <p className="stock">Stock: {p.stock}</p>

            <button
              className="addBtn"
              disabled={p.stock === 0}
              onClick={() => addToCart(p)}
            >
              {p.stock === 0 ? "Out of Stock" : "Add"}
            </button>

          </div>

        ))}

      </div>


      {/* ---------------- BILL ---------------- */}

      <div className="billSection">

        <h2>Bill</h2>

        <table>

          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {cart.map((item) => (

              <tr key={item.productId}>

                <td>{item.name}</td>

                <td>₹{item.price}</td>

                <td>

                  <button onClick={() => decreaseQty(item.productId)}>
                    -
                  </button>

                  {item.quantity}

                  <button onClick={() => increaseQty(item.productId)}>
                    +
                  </button>

                </td>

                <td>₹{item.price * item.quantity}</td>

                <td>

                  <button
                    className="removeBtn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        <h3 className="total">
          Total: ₹{total}
        </h3>


        <button
          className="billBtn"
          onClick={() => setShowCustomerModal(true)}
        >
          Generate Bill
        </button>

      </div>


      {/* ---------------- CUSTOMER MODAL ---------------- */}

      {showCustomerModal && (

        <div className="modalOverlay">

          <div className="modalBox">

            <h2>Customer Details</h2>

            <p>Enter phone number to complete billing</p>

            <input
              type="text"
              placeholder="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />

            <div className="modalButtons">

              <button
                className="cancelBtn"
                onClick={() => setShowCustomerModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirmBtn"
                onClick={generateOrder}
              >
                Confirm Order
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default CashierDashboard;