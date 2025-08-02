
export interface EstimationResult {
  itemName: string;
  estimatedPrice: number;
  priceRange: string;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
}
