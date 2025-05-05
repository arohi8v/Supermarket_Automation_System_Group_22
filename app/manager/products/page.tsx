"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getProducts, createProduct, updateProduct, deleteProduct, updateInventory } from "@/lib/api"

export default function ManagerProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    category: "",
    price: "",
    unitAvailable: "",
    location: "",
    floatDiscount: "",
    minThreshold: "",
    maxCapacity: "",
  })

  const fetchData = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      toast({
        title: "Error fetching products",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEdit = (product: any) => {
    setIsEditMode(true)
    setFormData(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))  // instant UI update
      toast({ title: "✅ Product deleted successfully" })
    } catch (error) {
      console.error("❌ Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const updateInventoryForProduct = async (productId, quantity) => {
    try {
      await updateInventory(productId, parseInt(quantity));
      console.log(`Updated inventory for product ${productId} with quantity ${quantity}`);
    } catch (error) {
      console.error(`Failed to update inventory for product ${productId}:`, error);
      // Don't throw error here to allow product creation to continue
    }
  }

  const handleSubmit = async () => {
    try {
      // Ensure numeric fields are properly formatted
      const formattedData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        unitAvailable: formData.unitAvailable ? parseInt(formData.unitAvailable) : 0,
        floatDiscount: formData.floatDiscount ? parseFloat(formData.floatDiscount) : 0,
        minThreshold: formData.minThreshold ? parseInt(formData.minThreshold) : 0,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : 100
      };

      if (isEditMode) {
        const updatedProduct = await updateProduct(formattedData.id, formattedData)
        
        // Update inventory with new quantity if it changed
        const originalProduct = products.find(p => p.id === formattedData.id);
        if (originalProduct && originalProduct.unitAvailable !== formattedData.unitAvailable) {
          await updateInventoryForProduct(formattedData.id, formattedData.unitAvailable);
        }
        
        // Update local state immediately
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === formattedData.id ? updatedProduct : p)
        )
        toast({ title: "✅ Product updated" })
      } else {
        const newProduct = await createProduct(formattedData)
        
        // Also update inventory for this new product
        await updateInventoryForProduct(newProduct.id, formattedData.unitAvailable);
        
        // Add the new product to the local state immediately
        setProducts(prevProducts => [...prevProducts, newProduct])
        toast({ title: "✅ Product created" })
      }
      setIsDialogOpen(false)
      resetForm();
    } catch (error) {
      console.error("❌ Error submitting product:", error)
      toast({
        title: "Error submitting product",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      price: "",
      unitAvailable: "",
      location: "",
      floatDiscount: "",
      minThreshold: "",
      maxCapacity: "",
    })
  }

  // Determine status based on quantity and reorder level
  const getStatus = (quantity, threshold) => {
    if (quantity === undefined || threshold === undefined) {
      return { text: "Unknown", class: "bg-gray-50 text-gray-700 border-gray-200" };
    }
    
    if (quantity <= 0) {
      return { text: "Out of Stock", class: "bg-red-50 text-red-700 border-red-200" };
    }
    
    if (quantity <= threshold) {
      return { text: "Low Stock", class: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    }
    
    return { text: "In Stock", class: "bg-green-50 text-green-700 border-green-200" };
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Product Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setIsEditMode(false)
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => {
                const status = getStatus(product.unitAvailable, product.minThreshold);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>{product.unitAvailable}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.class}>
                        {status.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="unitAvailable">Stock Quantity</Label>
              <Input id="unitAvailable" name="unitAvailable" type="number" value={formData.unitAvailable} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="floatDiscount">Discount (%)</Label>
              <Input id="floatDiscount" name="floatDiscount" type="number" step="0.01" value={formData.floatDiscount} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="minThreshold">Reorder Threshold</Label>
              <Input id="minThreshold" name="minThreshold" type="number" value={formData.minThreshold} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input id="maxCapacity" name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}