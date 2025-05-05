"use client"; // Required for using hooks like useState in a CSR component

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import ManagerLayout from "@/components/layouts/manager-layout";

// Mock data for different report types
const mockData = {
  sales: {
    generate: (startDate, endDate) => {
      const allItems = [
        { date: "2025-04-01", product: "Coffee Machine X2000", quantity: 5, unitPrice: 199.99, totalSales: 999.95, customer: "Café Sunrise" },
        { date: "2025-04-03", product: "Coffee Beans Premium", quantity: 20, unitPrice: 15.99, totalSales: 319.80, customer: "Downtown Bistro" },
        { date: "2025-04-05", product: "Milk Frother Pro", quantity: 8, unitPrice: 49.99, totalSales: 399.92, customer: "The Coffee Club" },
        { date: "2025-04-12", product: "Coffee Grinder", quantity: 3, unitPrice: 89.99, totalSales: 269.97, customer: "Bean & Brew" },
        { date: "2025-04-15", product: "Filter Papers (500pc)", quantity: 15, unitPrice: 8.99, totalSales: 134.85, customer: "Various Customers" },
        { date: "2025-04-18", product: "Coffee Machine X3000", quantity: 2, unitPrice: 349.99, totalSales: 699.98, customer: "Corporate Coffee" },
        { date: "2025-04-23", product: "Espresso Cups Set", quantity: 10, unitPrice: 24.99, totalSales: 249.90, customer: "Home Barista" },
        { date: "2025-03-02", product: "Coffee Machine X2000", quantity: 3, unitPrice: 199.99, totalSales: 599.97, customer: "Mountain Café" },
        { date: "2025-03-05", product: "Coffee Beans Premium", quantity: 15, unitPrice: 15.99, totalSales: 239.85, customer: "Café Sunrise" },
        { date: "2025-03-10", product: "Milk Frother Pro", quantity: 5, unitPrice: 49.99, totalSales: 249.95, customer: "Downtown Bistro" }
      ];
      
      // Filter items by date range
      const filteredItems = allItems.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Add one day to end date to include the end date itself
        end.setDate(end.getDate() + 1);
        return itemDate >= start && itemDate < end;
      });
      
      return {
        items: filteredItems
      };
    }
  },
  inventory: {
    generate: (startDate, endDate) => {
      // For inventory, we'll assume this is the current snapshot at the time of the report
      return {
        items: [
          { productId: "CM-X2000", productName: "Coffee Machine X2000", inStock: 32, onOrder: 15, reorderLevel: 20, supplier: "BrewTech Inc" },
          { productId: "CB-PREM", productName: "Coffee Beans Premium", inStock: 150, onOrder: 50, reorderLevel: 100, supplier: "Global Bean Co" },
          { productId: "MF-PRO", productName: "Milk Frother Pro", inStock: 45, onOrder: 0, reorderLevel: 25, supplier: "BrewTech Inc" },
          { productId: "CG-BASIC", productName: "Coffee Grinder", inStock: 18, onOrder: 12, reorderLevel: 15, supplier: "Kitchen Essentials" },
          { productId: "FP-500", productName: "Filter Papers (500pc)", inStock: 80, onOrder: 0, reorderLevel: 50, supplier: "Paper Products Ltd" },
          { productId: "CM-X3000", productName: "Coffee Machine X3000", inStock: 12, onOrder: 10, reorderLevel: 10, supplier: "BrewTech Inc" },
          { productId: "EC-SET", productName: "Espresso Cups Set", inStock: 25, onOrder: 0, reorderLevel: 15, supplier: "Ceramic Delights" }
        ]
      };
    }
  },
  expenses: {
    generate: (startDate, endDate) => {
      const allItems = [
        { date: "2025-04-02", category: "Rent", description: "Monthly store rent", amount: 2500.00, paymentMethod: "Bank Transfer" },
        { date: "2025-04-05", category: "Utilities", description: "Electricity bill", amount: 350.25, paymentMethod: "Direct Debit" },
        { date: "2025-04-05", category: "Utilities", description: "Water bill", amount: 120.50, paymentMethod: "Direct Debit" },
        { date: "2025-04-10", category: "Inventory", description: "Coffee beans stock", amount: 1250.75, paymentMethod: "Credit Card" },
        { date: "2025-04-15", category: "Salaries", description: "Staff wages", amount: 4500.00, paymentMethod: "Bank Transfer" },
        { date: "2025-04-20", category: "Marketing", description: "Local newspaper ad", amount: 350.00, paymentMethod: "Credit Card" },
        { date: "2025-04-25", category: "Maintenance", description: "Equipment service", amount: 275.50, paymentMethod: "Cash" },
        { date: "2025-03-02", category: "Rent", description: "Monthly store rent", amount: 2500.00, paymentMethod: "Bank Transfer" },
        { date: "2025-03-08", category: "Utilities", description: "Electricity bill", amount: 320.15, paymentMethod: "Direct Debit" },
        { date: "2025-03-12", category: "Inventory", description: "Restock paper supplies", amount: 450.25, paymentMethod: "Credit Card" }
      ];
      
      // Filter items by date range
      const filteredItems = allItems.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Add one day to end date to include the end date itself
        end.setDate(end.getDate() + 1);
        return itemDate >= start && itemDate < end;
      });
      
      return {
        items: filteredItems
      };
    }
  }
};

// Simulated API function that returns mock data filtered by date range
const generateReport = async (reportType, startDate, endDate) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return appropriate mock data based on report type
  if (mockData[reportType]) {
    return mockData[reportType].generate(startDate, endDate);
  }
  
  throw new Error("Invalid report type");
};

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateReport(reportType, startDate, endDate);
      setReportData(data);
      
      if (data.items.length === 0) {
        toast({
          title: "Information",
          description: "No data found for the selected date range.",
          variant: "default",
        });
      }
      
      console.log("Report data:", data); // Debugging log
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData || !reportData.items || reportData.items.length === 0) {
      toast({
        title: "Information",
        description: "No data available to download.",
        variant: "default",
      });
      return;
    }

    let csv = "";

    // Convert report data to CSV
    const headers = Object.keys(reportData.items[0] || {});
    csv += headers.join(",") + "\n";

    reportData.items.forEach((item) => {
      const row = headers.map((header) => {
        const value = item[header];
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      });
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${reportType}-report-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderReportTable = () => {
    if (!reportData || !reportData.items || reportData.items.length === 0) {
      return <div className="text-center py-8 text-gray-500">No data available for the selected period.</div>;
    }

    const headers = Object.keys(reportData.items[0]);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h3>
            <p className="text-sm text-gray-500">
              {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={handleDownloadReport}>Download CSV</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, " $1")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.items.map((item, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>{item[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <ManagerLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="expenses">Expenses Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={handleGenerateReport} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {reportData && (
          <Card>
            <CardContent className="pt-6">{renderReportTable()}</CardContent>
          </Card>
        )}
      </div>
    </ManagerLayout>
  );
}