// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
// import { getStoreLayout } from "@/lib/api"

// export default function EmployeeStoreLayout() {
//   const [storeLayout, setStoreLayout] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedSection, setSelectedSection] = useState<string | null>(null)

//   useEffect(() => {
//     fetchStoreLayout()
//   }, [])

//   const fetchStoreLayout = async () => {
//     setIsLoading(true)
//     try {
//       const data = await getStoreLayout()
//       setStoreLayout(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch store layout. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Store Layout</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-8">Loading store layout...</div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (!storeLayout) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Store Layout</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-8 text-gray-500">Store layout information is not available.</div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Store Layout</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2">
//             <div className="border rounded-md p-4 bg-gray-50 h-[500px] relative">
//               {/* Store layout visualization */}
//               <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
//                 {storeLayout.sections.map((section: any) => (
//                   <div
//                     key={section.id}
//                     className={`border rounded-md flex items-center justify-center p-2 cursor-pointer transition-colors ${
//                       selectedSection === section.id ? "bg-blue-100 border-blue-300" : "bg-white hover:bg-gray-100"
//                     }`}
//                     style={{
//                       gridColumn: `span ${section.dimensions.width}`,
//                       gridRow: `span ${section.dimensions.height}`,
//                     }}
//                     onClick={() => setSelectedSection(section.id)}
//                   >
//                     <div className="text-center">
//                       <div className="font-medium">{section.name}</div>
//                       <div className="text-xs text-gray-500">{section.type}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Section Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {selectedSection ? (
//                   (() => {
//                     const section = storeLayout.sections.find((s: any) => s.id === selectedSection)
//                     return (
//                       <div className="space-y-4">
//                         <div>
//                           <h3 className="font-medium">{section.name}</h3>
//                           <p className="text-sm text-gray-500">{section.type}</p>
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-medium mb-1">Products in this section:</h4>
//                           {section.products && section.products.length > 0 ? (
//                             <ul className="space-y-1">
//                               {section.products.map((product: any) => (
//                                 <li key={product.id} className="text-sm">
//                                   {product.name} - Aisle {product.aisle}
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <p className="text-sm text-gray-500">No products in this section.</p>
//                           )}
//                         </div>

//                         <div className="pt-2">
//                           <Button variant="outline" size="sm" className="w-full">
//                             View All Products
//                           </Button>
//                         </div>
//                       </div>
//                     )
//                   })()
//                 ) : (
//                   <div className="text-center py-4 text-gray-500">Select a section to view details</div>
//                 )}
//               </CardContent>
//             </Card>

//             <div className="mt-4">
//               <Button variant="outline" className="w-full" onClick={fetchStoreLayout}>
//                 Refresh Layout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import ManagerLayout from "@/components/layouts/manager-layout"

const storeSections = [
  { key: "A", name: "Dairy" },
  { key: "B", name: "Bakery" },
  { key: "C", name: "Produce" },
  { key: "D", name: "Meat" },
  { key: "E", name: "Checkout" },
]

const productsData: Record<string, { section: string; inStock: boolean }> = {
  Milk: { section: "A", inStock: true },
  Cheese: { section: "A", inStock: true },
  Yogurt: { section: "A", inStock: false },
  Bread: { section: "B", inStock: true },
  Bagel: { section: "B", inStock: false },
  Croissant: { section: "B", inStock: true },
  Apple: { section: "C", inStock: true },
  Banana: { section: "C", inStock: true },
  Carrot: { section: "C", inStock: true },
  Chicken: { section: "D", inStock: true },
  Beef: { section: "D", inStock: false },
  Pork: { section: "D", inStock: true },
}

const sectionColors: Record<string, string> = {
  A: "ring-4 ring-yellow-400 scale-105",
  B: "ring-4 ring-orange-400 scale-105",
  C: "ring-4 ring-green-400 scale-105",
  D: "ring-4 ring-red-400 scale-105",
}

export default function StoreLayout() {
  const [search, setSearch] = useState("")

  // Find product info by search
  const foundProduct = Object.entries(productsData).find(
    ([name]) => name.toLowerCase() === search.trim().toLowerCase()
  )

  // Find which section to highlight
  const highlightedSection =
    foundProduct && foundProduct[1].inStock ? foundProduct[1].section : null

  return (
    <ManagerLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Store Layout Map</h1>

        <Input
          type="text"
          placeholder="Search for a product..."
          className="mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Search result message */}
        {search.trim() && (
          <div className="mb-4 text-md font-semibold">
            {foundProduct ? (
              foundProduct[1].inStock ? (
                <span className="text-green-700">
                  {foundProduct[0]} is in {storeSections.find(s => s.key === foundProduct[1].section)?.name} ({foundProduct[1].section})
                </span>
              ) : (
                <span className="text-red-700">
                  {foundProduct[0]} is out of stock.
                </span>
              )
            ) : (
              <span className="text-gray-700">Product not found.</span>
            )}
          </div>
        )}

        {/* Store Layout Grid */}
        <div className="grid grid-cols-2 grid-rows-3 gap-4 h-[500px] text-lg font-medium text-center mb-10">
          {/* Produce (C) - Top left, large */}
          <div
            className={`row-span-2 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "C" ? sectionColors["C"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Produce</div>
              <div className="text-sm text-gray-500">C</div>
            </div>
          </div>
          {/* Bakery (B) - Top right */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "B" ? sectionColors["B"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Bakery</div>
              <div className="text-sm text-gray-500">B</div>
            </div>
          </div>
          {/* Dairy (A) - Middle left */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "A" ? sectionColors["A"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Dairy</div>
              <div className="text-sm text-gray-500">A</div>
            </div>
          </div>
          {/* Meat (D) - Middle right */}
          <div
            className={`row-span-1 col-span-1 border flex items-center justify-center transition-all duration-200 bg-white
              ${highlightedSection === "D" ? sectionColors["D"] : ""}
            `}
          >
            <div>
              <div className="text-2xl font-bold">Meat</div>
              <div className="text-sm text-gray-500">D</div>
            </div>
          </div>
          {/* Checkout (E) - Bottom right */}
          <div className="row-span-1 col-span-2 border flex items-center justify-center bg-green-100">
            <div>
              <div className="text-2xl font-bold">Checkout</div>
              <div className="text-sm text-gray-500">E</div>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}