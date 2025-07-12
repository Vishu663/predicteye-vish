"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Prediction } from "@/lib/types";
import { BarChart3, Calendar, DollarSign, TrendingUp } from "lucide-react";
import Image from "next/image";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

// Component to display prediction data
const PredictionDisplay = ({ prediction }: { prediction: Prediction }) => {
  if (!prediction) {
    console.log("No prediction data available");
    return null;
  }

  // Prepare data for the resale chart
  const chartData = Object.entries(prediction.resale_in_year || {}).map(
    ([year, value]) => {
      // Extract numeric value from currency string (e.g., "$10,000" -> 10000)
      const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
      return {
        year,
        value: numericValue,
        displayValue: value, // Keep the original formatted value for display
      };
    },
  );

  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{data.year}</span>
          </div>
          <div className="mt-1 text-lg font-bold text-primary">
            {data.displayValue}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 rounded-lg border border-primary/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">
          <BarChart3 className="mr-2 inline-block h-5 w-5" />
          Prediction Results
        </h3>
      </div>

      {/* Top row: Image and Price */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column with image */}
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          {prediction.image ? (
            <Image
              src={prediction.image || "/placeholder.svg"}
              alt={prediction.chat_name || "Prediction image"}
              width={400}
              height={300}
              className="h-auto w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-[200px] items-center justify-center bg-muted/20">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>

        {/* Right column with price */}
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <CardHeader className="relative pb-2">
            <CardTitle className="flex items-center text-base">
              <DollarSign className="mr-1 h-4 w-4" />
              Estimated Price
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-3xl font-bold text-primary">
              {prediction.estimated_price || "Not available"}
            </p>

            {prediction.price_variation &&
              prediction.price_variation.length > 0 && (
                <div className="mt-4 rounded-md bg-background/50 p-3 text-sm">
                  <p className="font-medium">Price range:</p>
                  <ul className="mt-2 space-y-1">
                    {prediction.price_variation.map((variation, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Chart and User Inputs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Resale Value Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <TrendingUp className="mr-1 h-4 w-4" />
                Resale Value Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-1 h-80">
              {/* Ensure the parent container has a defined height */}
              <div className="relative h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                      axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Inputs */}
        {prediction.user_inputs &&
          Object.keys(prediction.user_inputs).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Input Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(prediction.user_inputs)
                    .filter(
                      ([key, value]) =>
                        value !== null &&
                        value !== undefined &&
                        value !== "" &&
                        key !== "image_url" &&
                        key !== "additional_details",
                    )
                    .map(([key, value]) => (
                      <div key={key} className="rounded-md bg-muted/30 p-2">
                        <p className="text-xs text-muted-foreground">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="mt-1 truncate font-medium">
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
};

export default PredictionDisplay;
