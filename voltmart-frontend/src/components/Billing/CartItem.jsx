function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>₹{item.price}</td>
      <td>
        <button onClick={() => onDecrease(item.productId)}>-</button>
        {item.quantity}
        <button onClick={() => onIncrease(item.productId)}>+</button>
      </td>
      <td>₹{item.price * item.quantity}</td>
      <td>
        <button className="removeBtn" onClick={() => onRemove(item.productId)}>
          Remove
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
