function ProductForm({ form, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <div className="vm-form-grid">
      <label className="vm-form-grid__field">
        <span>Name</span>
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label className="vm-form-grid__field">
        <span>Category</span>
        <input name="category" value={form.category} onChange={handleChange} />
      </label>
      <label className="vm-form-grid__field">
        <span>Brand</span>
        <input name="brand" value={form.brand} onChange={handleChange} />
      </label>
      <label className="vm-form-grid__field">
        <span>Price</span>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
      </label>
      <label className="vm-form-grid__field">
        <span>Stock</span>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
      </label>
      <label className="vm-form-grid__field" style={{ gridColumn: "1 / -1" }}>
        <span>Description</span>
        <input
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Product description"
        />
      </label>
      <label className="vm-form-grid__field">
        <span>Rack location</span>
        <input
          name="rackLocation"
          value={form.rackLocation || ""}
          onChange={handleChange}
          placeholder="e.g. A1-01"
        />
      </label>
    </div>
  );
}

export default ProductForm;
