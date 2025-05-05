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