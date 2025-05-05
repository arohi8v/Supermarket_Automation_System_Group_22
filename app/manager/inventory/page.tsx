"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getInventory, updateInventory, getProducts } from "@/lib/api"

export default function ManagerInventory() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [filteredInventory, setFilteredInventory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [newQuantity, setNewQuantity] = useState("")
  const [newProductName, setNewProductName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Add product form state
  const [addProductId, setAddProductId] = useState("")
  const [addProductName, setAddProductName] = useState("")
  const [addQuantity, setAddQuantity] = useState("")
  const [addLocation, setAddLocation] = useState("")
  const [addReorderLevel, setAddReorderLevel] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInventory(inventory)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = inventory.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(lowercaseSearch);
        });
      })
      setFilteredInventory(filtered)
    }
  }, [searchTerm, inventory])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [inventoryData, productsData] = await Promise.all([
        getInventory(),
        getProducts()
      ])

      let processedInventory = Array.isArray(inventoryData) ? [...inventoryData] : []

      if (Array.isArray(productsData)) {
        setProducts(productsData)

        const inventoryMap = new Map()
        processedInventory.forEach(item => {
          const id = item.productId || item.id
          if (id) inventoryMap.set(id, item)
        })

        productsData.forEach(product => {
          if (!inventoryMap.has(product.id)) {
            processedInventory.push({
              productId: product.id,
              quantity: product.unitAvailable || 0,
              location: product.location || "Warehouse",
              reorderLevel: product.minThreshold || 0,
              maxCapacity: product.maxCapacity || 100
            })
          }
        })
      }

      setInventory(processedInventory)
      setFilteredInventory(processedInventory)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inventory data. Please try again.",
        variant: "destructive",
      })
      setInventory([])
      setFilteredInventory([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateInventory = async () => {
    if (!selectedItem || !newQuantity.trim() || isNaN(Number(newQuantity))) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      })
      return
    }

    const itemId = selectedItem.productId || selectedItem.id
    if (!itemId) {
      toast({
        title: "Error",
        description: "Invalid item selected.",
        variant: "destructive",
      })
      return
    }

    const updatedName = newProductName.trim()

    setIsUpdating(true)
    try {
      await updateInventory(itemId, Number(newQuantity), updatedName)

      const updatedInventory = inventory.map(item => {
        const currentItemId = item.productId || item.id
        if (currentItemId === itemId) {
          return { ...item, quantity: Number(newQuantity) }
        }
        return item
      })

      const updatedProducts = products.map(p =>
        p.id === itemId ? { ...p, name: updatedName } : p
      )

      setInventory(updatedInventory)
      setFilteredInventory(updatedInventory)
      setProducts(updatedProducts)

      toast({
        title: "Success",
        description: "Inventory updated successfully.",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating inventory:", error)
      toast({
        title: "Error",
        description: `Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddInventory = () => {
    if (!addProductId.trim() || !addProductName.trim() || isNaN(Number(addQuantity))) {
      toast({
        title: "Error",
        description: "Please enter valid product ID, name, and quantity.",
        variant: "destructive",
      })
      return
    }

    const newItem = {
      id: addProductId,
      productId: addProductId,
      name: addProductName,
      quantity: Number(addQuantity),
      location: addLocation || "Warehouse",
      reorderLevel: Number(addReorderLevel) || 5,
      maxCapacity: 100
    }

    const newInventory = [...inventory, newItem]
    const newProducts = [...products, { id: addProductId, name: addProductName }]

    setInventory(newInventory)
    setFilteredInventory(newInventory)
    setProducts(newProducts)

    toast({
      title: "Success",
      description: "Product added successfully to inventory.",
    })

    setIsAddDialogOpen(false)
    setAddProductId("")
    setAddProductName("")
    setAddQuantity("")
    setAddLocation("")
    setAddReorderLevel("")
  }

  const handleUpdateClick = (item: any) => {
    const itemId = item.productId || item.id
    const currentProduct = products.find(p => p.id === itemId)
    setSelectedItem(item)
    setNewQuantity(item.quantity?.toString() || "0")
    setNewProductName(currentProduct?.name || item.name || "")
    setIsDialogOpen(true)
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  const getStatus = (quantity, reorderLevel) => {
    if (quantity === undefined || reorderLevel === undefined) {
      return { text: "Unknown", class: "bg-gray-50 text-gray-700 border-gray-200" }
    }
    if (quantity <= 0) {
      return { text: "Out of Stock", class: "bg-red-50 text-red-700 border-red-200" }
    }
    if (quantity <= reorderLevel) {
      return { text: "Low Stock", class: "bg-yellow-50 text-yellow-700 border-yellow-200" }
    }
    return { text: "In Stock", class: "bg-green-50 text-green-700 border-green-200" }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={fetchData}>Refresh</Button>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>Add Product</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading inventory...</div>
        ) : filteredInventory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStatus(item.quantity, item.reorderLevel)
                const productId = item.productId || item.id

                return (
                  <TableRow key={productId}>
                    <TableCell>{productId}</TableCell>
                    <TableCell>{getProductName(productId)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.class}>
                        {status.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateClick(item)}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">No inventory items found matching your search.</div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Product to Inventory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="add-product-id">Product ID</Label>
                <Input
                  id="add-product-id"
                  value={addProductId}
                  onChange={(e) => setAddProductId(e.target.value)}
                  placeholder="e.g. 6 or BANANA01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-product-name">Product Name</Label>
                <Input
                  id="add-product-name"
                  value={addProductName}
                  onChange={(e) => setAddProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-quantity">Quantity</Label>
                <Input
                  id="add-quantity"
                  type="number"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-location">Location</Label>
                <Input
                  id="add-location"
                  value={addLocation}
                  onChange={(e) => setAddLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-reorder-level">Reorder Level</Label>
                <Input
                  id="add-reorder-level"
                  type="number"
                  value={addReorderLevel}
                  onChange={(e) => setAddReorderLevel(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddInventory}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
