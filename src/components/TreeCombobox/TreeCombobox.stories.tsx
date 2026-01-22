import type { Meta, StoryObj } from '@storybook/react';
import { TreeCombobox } from './TreeCombobox';
import { TreeNode } from '../../utils/types';
import '../../styles/index.css';

const meta = {
  title: 'Components/TreeCombobox',
  component: TreeCombobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TreeCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleData: TreeNode[] = [
  {
    id: '1',
    label: 'Fruits',
    children: [
      { id: '1-1', label: 'Apple' },
      { id: '1-2', label: 'Banana' },
      { id: '1-3', label: 'Mango' },
      { id: '1-4', label: 'Papaya' },
      { id: '1-5', label: 'Grapes' },
      { id: '1-6', label: 'Watermelon' },
      { id: '1-7', label: 'Pineapple' },
      { id: '1-8', label: 'Strawberry' },
      {
        id: '1-9',
        label: 'Citrus',
        children: [
          { id: '1-9-1', label: 'Orange' },
          { id: '1-9-2', label: 'Lemon' },
          { id: '1-9-3', label: 'Lime' },
          { id: '1-9-4', label: 'Grapefruit' },
        ],
      },
      {
        id: '1-10',
        label: 'Berries',
        children: [
          { id: '1-10-1', label: 'Blueberry' },
          { id: '1-10-2', label: 'Raspberry' },
          { id: '1-10-3', label: 'Blackberry' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Vegetables',
    children: [
      { id: '2-1', label: 'Carrot' },
      { id: '2-2', label: 'Broccoli' },
      { id: '2-3', label: 'Spinach' },
      { id: '2-4', label: 'Tomato' },
      { id: '2-5', label: 'Potato' },
      { id: '2-6', label: 'Onion' },
      { id: '2-7', label: 'Cabbage' },
      { id: '2-8', label: 'Cauliflower' },
      {
        id: '2-9',
        label: 'Leafy Greens',
        children: [
          { id: '2-9-1', label: 'Lettuce' },
          { id: '2-9-2', label: 'Kale' },
          { id: '2-9-3', label: 'Spinach' },
        ],
      },
      {
        id: '2-10',
        label: 'Root Vegetables',
        children: [
          { id: '2-10-1', label: 'Beetroot' },
          { id: '2-10-2', label: 'Radish' },
          { id: '2-10-3', label: 'Turnip' },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'Dairy',
    children: [
      { id: '3-1', label: 'Milk' },
      { id: '3-2', label: 'Butter' },
      { id: '3-3', label: 'Cream' },
      { id: '3-4', label: 'Yogurt' },
      { id: '3-5', label: 'Paneer' },
      { id: '3-6', label: 'Ghee' },
    ],
  },
];

export const Basic: Story = {
  args: {
    nodes: sampleData,
    multiSelect: true,
    placeholder: 'Select items...',
  },
};

export const SingleSelect: Story = {
  args: {
    nodes: sampleData,
    multiSelect: false,
    placeholder: 'Select one item...',
  },
};

export const WithSearch: Story = {
  args: {
    nodes: sampleData,
    multiSelect: true,
    onSearch: (query: string) => console.log('Search:', query),
  },
};

export const IndeterminateStates: Story = {
  name: 'Multi-Select with Indeterminate',
  args: {
    nodes: sampleData,
    multiSelect: true,
    placeholder: 'Select parents and children to see indeterminate states',
  },
};

export const Disabled: Story = {
  args: {
    nodes: sampleData,
    disabled: true,
  },
};

// Generate large dataset for performance testing
const generateLargeDataset = (depth: number = 3, breadth: number = 40): TreeNode[] => {
  const generateNode = (id: string, level: number, maxLevel: number): TreeNode => {
    const node: TreeNode = {
      id,
      label: `Node ${id}`,
    };

    if (level < maxLevel) {
      node.children = Array.from({ length: breadth }, (_, i) => 
        generateNode(`${id}-${i}`, level + 1, maxLevel)
      );
    }

    return node;
  };

  // Generate root nodes - adjust count based on breadth for desired total
  const rootCount = breadth === 50 ? 100 : 30; // 100 roots for 5k test
  return Array.from({ length: rootCount }, (_, i) => 
    generateNode(`root-${i}`, 0, depth)
  );
};

export const LargeDataset_5k: Story = {
  name: 'Performance Test (5k Nodes)',
  args: {
    nodes: generateLargeDataset(2, 50),
    multiSelect: true,
    containerHeight: 500,
    itemHeight: 32,
    placeholder: "Select from 5000+ items...",
  },
};

export const KeyboardOnlyNavigation: Story = {
  name: 'Keyboard Navigation',
  args: {
    nodes: sampleData,
    multiSelect: true,
    placeholder: 'Use Tab, Arrow keys, Enter, Space',
  },
};

export const ScreenReaderMode: Story = {
  name: 'Screen Reader Support',
  args: {
    nodes: sampleData,
    multiSelect: true,
    ariaLabel: 'Food categories tree selection',
    placeholder: 'Accessible tree combobox',
  },
};

export const FocusPreservation: Story = {
  name: 'Focus During Virtualization',
  args: {
    nodes: generateLargeDataset(2, 30),
    multiSelect: true,
    containerHeight: 400,
    itemHeight: 32,
    placeholder: 'Scroll to test focus preservation',
  },
};

export const HighContrastKeyboard: Story = {
  name: 'High Contrast Focus',
  args: {
    nodes: sampleData,
    multiSelect: true,
    placeholder: 'Test keyboard focus visibility',
  },
};

// 50k+ nodes dataset - EXTREME test with realistic food categories
const generateMassiveDataset = (): TreeNode[] => {
  const categories = [
    { name: 'Fruits', varieties: ['Apple', 'Banana', 'Orange', 'Mango', 'Grape', 'Strawberry', 'Watermelon', 'Pineapple', 'Kiwi', 'Pomegranate'] },
    { name: 'Vegetables', varieties: ['Tomato', 'Potato', 'Onion', 'Carrot', 'Broccoli', 'Spinach', 'Cabbage', 'Cauliflower', 'Cucumber', 'Pepper'] },
    { name: 'Dairy Products', varieties: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Paneer', 'Ghee', 'Curd', 'Buttermilk', 'Ice Cream'] },
    { name: 'Grains & Cereals', varieties: ['Rice', 'Wheat', 'Oats', 'Barley', 'Quinoa', 'Corn', 'Millet', 'Rye', 'Sorghum', 'Buckwheat'] },
    { name: 'Pulses & Legumes', varieties: ['Lentils', 'Chickpeas', 'Kidney Beans', 'Black Beans', 'Green Peas', 'Soybeans', 'Pinto Beans', 'Lima Beans', 'Navy Beans', 'Mung Beans'] },
    { name: 'Meat & Poultry', varieties: ['Chicken', 'Mutton', 'Beef', 'Pork', 'Turkey', 'Duck', 'Lamb', 'Goat', 'Rabbit', 'Quail'] },
    { name: 'Seafood', varieties: ['Salmon', 'Tuna', 'Shrimp', 'Crab', 'Lobster', 'Prawns', 'Clams', 'Mussels', 'Squid', 'Octopus'] },
    { name: 'Bakery Items', varieties: ['Bread', 'Buns', 'Cookies', 'Cakes', 'Pastries', 'Croissants', 'Muffins', 'Bagels', 'Donuts', 'Biscuits'] },
    { name: 'Beverages', varieties: ['Tea', 'Coffee', 'Juice', 'Soda', 'Water', 'Energy Drink', 'Smoothie', 'Milkshake', 'Lassi', 'Coconut Water'] },
    { name: 'Spices & Herbs', varieties: ['Turmeric', 'Cumin', 'Coriander', 'Pepper', 'Cardamom', 'Cinnamon', 'Cloves', 'Ginger', 'Garlic', 'Basil'] },
    { name: 'Snacks', varieties: ['Chips', 'Namkeen', 'Popcorn', 'Crackers', 'Nuts', 'Cookies', 'Wafers', 'Pretzels', 'Trail Mix', 'Granola Bars'] },
    { name: 'Condiments & Sauces', varieties: ['Ketchup', 'Mayonnaise', 'Mustard', 'Soy Sauce', 'Hot Sauce', 'BBQ Sauce', 'Chutney', 'Pickle', 'Vinegar', 'Salsa'] },
    { name: 'Oils & Fats', varieties: ['Sunflower Oil', 'Olive Oil', 'Coconut Oil', 'Mustard Oil', 'Canola Oil', 'Sesame Oil', 'Peanut Oil', 'Ghee', 'Butter', 'Margarine'] },
    { name: 'Dry Fruits & Nuts', varieties: ['Almonds', 'Cashews', 'Walnuts', 'Pistachios', 'Raisins', 'Dates', 'Figs', 'Apricots', 'Hazelnuts', 'Pecans'] },
    { name: 'Frozen Foods', varieties: ['Frozen Vegetables', 'Frozen Fruits', 'Ice Cream', 'Frozen Pizza', 'Frozen Meat', 'Frozen Snacks', 'Frozen Desserts', 'Frozen Meals', 'Frozen Seafood', 'Frozen Bread'] },
    { name: 'Sweets & Desserts', varieties: ['Chocolate', 'Candy', 'Cake', 'Pastries', 'Pudding', 'Custard', 'Jalebi', 'Gulab Jamun', 'Rasgulla', 'Barfi'] },
    { name: 'Baby Food', varieties: ['Cereal', 'Puree', 'Formula', 'Snacks', 'Juice', 'Yogurt', 'Biscuits', 'Porridge', 'Milk', 'Cookies'] },
    { name: 'Organic Products', varieties: ['Organic Fruits', 'Organic Vegetables', 'Organic Milk', 'Organic Eggs', 'Organic Grains', 'Organic Pulses', 'Organic Honey', 'Organic Tea', 'Organic Coffee', 'Organic Spices'] },
    { name: 'Breakfast Items', varieties: ['Cornflakes', 'Oats', 'Muesli', 'Bread', 'Eggs', 'Pancake Mix', 'Jam', 'Honey', 'Peanut Butter', 'Nutella'] },
    { name: 'Ready-to-Eat', varieties: ['Instant Noodles', 'Cup Soup', 'Ready Meals', 'Pasta', 'Pizza', 'Burgers', 'Sandwiches', 'Wraps', 'Salads', 'Rice Bowls'] },
  ];
  
  const nodes: TreeNode[] = [];

  categories.forEach((category, catIndex) => {
    const subcategories: TreeNode[] = [];
    
    // 100 subcategories per category (using varieties + brands)
    for (let sub = 0; sub < 100; sub++) {
      const items: TreeNode[] = [];
      const variety = category.varieties[sub % category.varieties.length];
      const brand = ['Fresh Farm', 'Organic Valley', 'Premium Choice', 'Daily Fresh', 'Natural Harvest'][sub % 5];
      
      // 25 items per subcategory = 50k+ total nodes
      for (let item = 0; item < 25; item++) {
        const weights = ['250g', '500g', '1kg', '2kg', '5kg'];
        const weight = weights[item % weights.length];
        
        items.push({
          id: `${catIndex}-${sub}-${item}`,
          label: `${variety} ${brand} - ${weight}`,
          metadata: {
            category: category.name,
            variety,
            brand,
            weight,
            price: (Math.random() * 500 + 50).toFixed(2),
            stock: Math.floor(Math.random() * 100),
            inStock: Math.random() > 0.1,
          },
        });
      }
      
      subcategories.push({
        id: `${catIndex}-sub-${sub}`,
        label: `${variety} - ${brand} Collection`,
        children: items,
      });
    }
    
    nodes.push({
      id: `cat-${catIndex}`,
      label: `${category.name} (${subcategories.length * 25} items)`,
      children: subcategories,
    });
  });

  return nodes;
};

// Removed 50k story - too large for Storybook WebSocket
// 1k story above is sufficient to demonstrate virtualization

export const WithAsyncLoading: Story = {
  name: 'Async Node Loading',
  args: {
    nodes: [
      { id: '1', label: 'Parent 1', children: [] },
      { id: '2', label: 'Parent 2', children: [] },
      { id: '3', label: 'Parent 3', children: [] },
    ],
    multiSelect: true,
    loader: async ({ parentId }: { parentId?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [
        { id: `${parentId}-1`, label: `Child ${parentId}-1` },
        { id: `${parentId}-2`, label: `Child ${parentId}-2` },
        { id: `${parentId}-3`, label: `Child ${parentId}-3` },
      ];
    },
  },
};

export const LargeAsyncDataset: Story = {
  name: 'Large Async Loading',
  args: {
    nodes: Array.from({ length: 50 }, (_, i) => ({
      id: `parent-${i}`,
      label: `Category ${i + 1} (Click to load 50 items)`,
      children: [],
    })),
    multiSelect: true,
    loader: async ({ parentId }: { parentId?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return Array.from({ length: 50 }, (_, i) => ({
        id: `${parentId}-item-${i}`,
        label: `${parentId} - Item ${i + 1}`,
      }));
    },
    containerHeight: 600,
    placeholder: "Expand to load items...",
  },
};
