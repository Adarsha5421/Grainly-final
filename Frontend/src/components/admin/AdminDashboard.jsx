import React, { useState, useEffect } from "react";
import api, {
  getAllpulses,
  getAllBookings,
  getAllUsers,
  createpulses,
  updatepulses,
  deletepulses,
  updateBookingStatus,
  blockUser,
  unblockUser,
  getProfile,
  updateProfile,
  getAllContacts,
  deleteContact,
} from "../../api/api";
import ActivityMonitoring from "./ActivityMonitoring";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Activity, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  Box, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  AlertTriangle,
  Shield,
  LogOut,
  Home,
  Filter
} from "lucide-react";

const sections = [
  { key: "overview", label: "Dashboard Overview", icon: BarChart3 },
  { key: "products", label: "Product Management", icon: Package },
  { key: "orders", label: "Order Management", icon: ShoppingCart },
  { key: "users", label: "User Management", icon: Users },
  { key: "contacts", label: "Contact/Inquiry Management", icon: MessageSquare },
  { key: "activity", label: "Activity Logs", icon: Activity },
  { key: "monitoring", label: "Activity Monitoring", icon: Shield },
  { key: "profile", label: "Admin Profile & Settings", icon: Settings },
];

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded mb-4">{error.toString()}</div>;
  }
  return React.cloneElement(children, { setError });
}

function DashboardOverview({ setError }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllBookings(),
      getAllUsers(),
      getAllpulses(),
    ])
      .then(([orders, users, products]) => {
        setOrders(orders);
        setUsers(users);
        setProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, [setError]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentOrders = sortedOrders.slice(0, 5);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Orders" value={totalOrders} icon={ShoppingCart} trend={12} />
        <StatCard label="Total Sales" value={`Rs ${totalSales.toLocaleString()}`} icon={DollarSign} trend={8} />
        <StatCard label="Total Users" value={totalUsers} icon={UserCheck} trend={15} />
        <StatCard label="Total Products" value={totalProducts} icon={Box} trend={5} />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Recent Orders
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900 divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">#{o._id.slice(-6)}</td>
                  <td className="px-6 py-4">{o.user?.name || "Guest"}</td>
                  <td className="px-6 py-4">{o.pulses?.name || "Unknown Product"}</td>
                  <td className="px-6 py-4 font-semibold">Rs {o.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>
  );
}

function ProductManagement({ setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getAllpulses()
      .then(setProducts)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updatepulses(editing, form);
        toast.success("Product updated.");
      } else {
        await createpulses(form);
        toast.success("Product added.");
      }
      setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);
    try {
      await deletepulses(id);
      fetchProducts();
      toast.success("Product deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete product");
      toast.error(err.message || "Failed to delete product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{products.length} products</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            {editing ? "Edit Product" : "Add New Product"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter product name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                required 
                disabled={saving} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Gram (Rs)</label>
              <input 
                name="pricePerGram" 
                value={form.pricePerGram} 
                onChange={handleChange} 
                placeholder="0.00" 
                type="number" 
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                required 
                disabled={saving} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input 
                name="stock" 
                value={form.stock} 
                onChange={handleChange} 
                placeholder="0" 
                type="number" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                required 
                disabled={saving} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Filename</label>
              <input 
                name="image" 
                value={form.image} 
                onChange={handleChange} 
                placeholder="e.g. almonds.jpg" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                required 
                disabled={saving} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Enter product description" 
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                required 
                disabled={saving} 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {editing ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => { setEditing(null); setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" }); }} 
                className="text-gray-500 hover:text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Get started by adding your first product.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Product Catalog
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Price/Gram</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-900 divide-y divide-gray-100">
                {products.map((p) => {
                  const imgSrc = p.image
                    ? `http://localhost:5000/uploads/${p.image}`
                    : "http://localhost:5000/uploads/placeholder.jpg";
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{p.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <img 
                          src={imgSrc} 
                          alt={p.name} 
                          className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">Rs {p.pricePerGram}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 10 ? 'bg-green-100 text-green-800' :
                          p.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(p)} 
                            className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p._id)} 
                            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderManagement({ setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAllBookings()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, [setError]);

  const handleStatus = async (id, status) => {
    setSaving(true);
    try {
      await updateBookingStatus(id, status);
      fetchOrders();
      toast.success("Order status updated.");
    } catch (err) {
      setError(err.message || "Failed to update status");
      toast.error(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      {loading ? <div>Loading...</div> : orders.length === 0 ? <div>No orders found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Weight (g)</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{o._id.slice(-6)}</td>
                  <td className="px-4 py-2">{o.user?.name || "-"}</td>
                  <td className="px-4 py-2">{o.pulses?.name || "-"}</td>
                  <td className="px-4 py-2">{o.weight}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">Rs {o.totalPrice}</td>
                  <td className="px-4 py-2">
                    <span className="capitalize font-semibold">{o.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={o.status}
                      onChange={e => handleStatus(o._id, e.target.value)}
                      disabled={saving}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserManagement({ setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [setError]);

  const handleBlock = async (id, block) => {
    setSaving(true);
    try {
      if (block) {
        await blockUser(id);
        toast.success("User blocked.");
      } else {
        await unblockUser(id);
        toast.success("User unblocked.");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
      toast.error(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading ? <div>Loading...</div> : users.length === 0 ? <div>No users found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{u._id.slice(-6)}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.isAdmin ? "Admin" : "Customer"}</td>
                  <td className="px-4 py-2">{u.blocked ? <span className="text-red-600 font-semibold">Blocked</span> : <span className="text-green-600 font-semibold">Active</span>}</td>
                  <td className="px-4 py-2">
                    {u.isAdmin ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : u.blocked ? (
                      <button onClick={() => handleBlock(u._id, false)} className="text-xs bg-black text-white px-2 py-1 rounded" disabled={saving}>Unblock</button>
                    ) : (
                      <button onClick={() => handleBlock(u._id, true)} className="text-xs bg-red-600 text-white px-2 py-1 rounded" disabled={saving}>Block</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContactManagement({ setError }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContacts = () => {
    setLoading(true);
    getAllContacts()
      .then(setContacts)
      .catch((err) => setError(err.message || "Failed to load messages"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchContacts, [setError]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setSaving(true);
    try {
      await deleteContact(id);
      fetchContacts();
      toast.success("Message deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete message");
      toast.error(err.message || "Failed to delete message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact/Inquiry Management</h2>
      {loading ? <div>Loading...</div> : contacts.length === 0 ? <div>No messages found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {contacts.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(c._id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded" disabled={saving}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActivityLogs({ setError }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    const url = userFilter ? `/users/activity-logs?user=${userFilter}` : "/users/activity-logs";
    Promise.all([
      api.get(url),
      getAllUsers()
    ])
      .then(([logRes, users]) => {
        setLogs(Array.isArray(logRes.data) ? logRes.data : []);
        setUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load activity logs");
        setLoading(false);
      });
  }, [setError, userFilter]);

  if (!Array.isArray(logs)) return <div>Error: Activity logs data is not an array.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>
      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm">Filter by user:</label>
        <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
        </select>
      </div>
      {loading ? <div>Loading logs...</div> : logs.length === 0 ? <div>No activity logs found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">IP</th>
                <th className="px-2 py-2">Action</th>
                <th className="px-2 py-2">Method</th>
                <th className="px-2 py-2">URL</th>
                <th className="px-2 py-2">Info</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {logs.map(log => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2">{
                    log.user && typeof log.user === 'object'
                      ? `${log.user.name || ''} (${log.user.email || log.user._id || ''})`
                      : log.user
                        ? log.user
                        : <span className="text-gray-400">Visitor</span>
                  }</td>
                  <td className="px-2 py-2">{log.ip}</td>
                  <td className="px-2 py-2">{log.action}</td>
                  <td className="px-2 py-2">{log.method}</td>
                  <td className="px-2 py-2">{log.url}</td>
                  <td className="px-2 py-2">{log.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminProfileSettings({ setError }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ email: data.email, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully.");
      setForm(f => ({ ...f, password: "" }));
      toast.success("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="border px-3 py-2 rounded w-full" required disabled={saving} />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" className="border px-3 py-2 rounded w-full" placeholder="Leave blank to keep current password" disabled={saving} />
        </div>
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800 transition w-full" disabled={saving}>Update Profile</button>
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
      <div className="mt-8">
        <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition">Logout</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Grainly Management</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  section === s.key
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${section === s.key ? 'text-green-600' : 'text-gray-400'}`} />
                {s.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Grainly
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {section === "overview" && <ErrorBoundary><DashboardOverview /></ErrorBoundary>}
          {section === "products" && <ErrorBoundary><ProductManagement /></ErrorBoundary>}
          {section === "orders" && <ErrorBoundary><OrderManagement /></ErrorBoundary>}
          {section === "users" && <ErrorBoundary><UserManagement /></ErrorBoundary>}
          {section === "contacts" && <ErrorBoundary><ContactManagement /></ErrorBoundary>}
          {section === "activity" && <ErrorBoundary><ActivityLogs /></ErrorBoundary>}
          {section === "monitoring" && <ErrorBoundary><ActivityMonitoring /></ErrorBoundary>}
          {section === "profile" && <ErrorBoundary><AdminProfileSettings /></ErrorBoundary>}
        </div>
      </main>
    </div>
  );
} 