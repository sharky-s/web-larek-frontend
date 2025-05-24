import { CartItem, Product } from '../types';

interface AppState {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

type Listener = (state: AppState) => void;

export class Store {
  private state: AppState = {
    products: [],
    cart: [],
    loading: false,
    error: null
  };
  
  private listeners: Listener[] = [];
  
  getState(): AppState {
    return this.state;
  }
  
  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  
  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // Cart methods
  addToCart(product: Product) {
    const existingItem = this.state.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      this.setState({
        cart: this.state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      this.setState({
        cart: [...this.state.cart, { product, quantity: 1 }]
      });
    }
  }
  
  removeFromCart(productId: string) {
    this.setState({
      cart: this.state.cart.filter(item => item.product.id !== productId)
    });
  }
  
  clearCart() {
    this.setState({ cart: [] });
  }
} 