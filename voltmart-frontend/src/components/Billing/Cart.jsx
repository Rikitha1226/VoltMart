import CartItem from "./CartItem";

function Cart({ items, onIncrease, onDecrease, onRemove, total, onCheckout }) {
  return (
    <div className="billSection">
      <h2>Bill</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>

      <h3 className="total">Total: ₹{total}</h3>

      <button className="billBtn" onClick={onCheckout}>
        Generate Bill
      </button>
    </div>
  );
}

export default Cart;
