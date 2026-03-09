import { useEffect, useMemo, useState } from "react";
import { productsApi } from "../api/api";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Table from "../components/UI/Table";
import Modal from "../components/UI/Modal";
import ProductForm from "../components/Forms/ProductForm";
import SearchBar from "../components/Forms/SearchBar";

const PAGE_SIZE = 8;

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    rackLocation: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await productsApi.list();
      const data = response?.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load products.";
      setError(typeof msg === "string" ? msg : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await productsApi.lowStock();
      setProducts(response.data || []);
      setPage(1);
    } catch (err) {
      setError("Failed to load low stock items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      description: "",
      rackLocation: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      rackLocation: product.rackLocation || "",
    });
    setModalOpen(true);
  };

  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError("Please fill in required fields: name, price, stock.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name,
        category: form.category,
        brand: form.brand,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description || null,
        rackLocation: form.rackLocation || null,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
      } else {
        await productsApi.create(payload);
      }

      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError("Unable to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete product "${product.name}"?`);

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      await productsApi.remove(product.id);
      await loadProducts();
    } catch (err) {
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await productsApi.searchByName(search.trim());
      setProducts(response.data || []);
      setPage(1);
    } catch (err) {
      setError("Failed to search products.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter) {
      list = list.filter((product) => product.category === categoryFilter);
    }

    return list;
  }, [products, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const pageItems = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );

  return (
    <div className="vm-page">
      <div className="vm-page__header">
        <h1>Products</h1>
        <p>Manage catalog, pricing, and inventory.</p>
      </div>

      {error && <div className="vm-alert vm-alert--error">{error}</div>}

      <div className="vm-page__grid">
        <Card
          title="Add product"
          subtitle="Quickly add or update products."
          actions={<Button onClick={openCreateModal}>New Product</Button>}
        >
          <div className="vm-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              placeholder="Search products by name..."
            />

            <div className="vm-toolbar__group">
              <select
                className="vm-input"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <Button variant="ghost" onClick={loadLowStock}>
                Low stock
              </Button>
              <Button variant="ghost" onClick={loadProducts}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Products list">
          {loading ? (
            <div className="vm-table__loading">Loading...</div>
          ) : (
            <>
              <Table
                columns={[
                  { header: "ID", accessor: "id" },
                  { header: "Name", accessor: "name" },
                  { header: "Category", accessor: "category" },
                  { header: "Brand", accessor: "brand" },
                  { header: "Price", accessor: "price" },
                  { header: "Stock", accessor: "stock" },
                  { header: "Rack", accessor: "rackLocation" },
                  { header: "Description", accessor: "description" },
                  { header: "Actions", accessor: "actions", key: "actions" },
                ]}
                data={pageItems}
                rowKey="id"
                renderRow={(product) => (
                  <tr
                    key={product.id}
                    className={product.stock < 5 ? "vm-row--low-stock" : ""}
                  >
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.rackLocation || "—"}</td>
                    <td title={product.description || ""}>
                      {product.description
                        ? product.description.length > 30
                          ? product.description.slice(0, 30) + "…"
                          : product.description
                        : "—"}
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        className="vm-btn--sm"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="vm-btn--sm"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )}
              />

              <div className="vm-pagination">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <Modal
        open={modalOpen}
        title={editingProduct ? "Edit product" : "Add product"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {editingProduct ? "Save changes" : "Add product"}
            </Button>
          </>
        }
      >
        <ProductForm form={form} onChange={handleFormChange} />
      </Modal>
    </div>
  );
}

export default ProductManagement;
