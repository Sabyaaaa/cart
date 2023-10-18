import { useReducer, useMemo, createContext, ReactElement } from "react";
import data from "../data/products.json";

export type CartItemType = {
  id: number;
  product_name: string;
  sizes: string[];
  image_url: string;
  price: number;
  quantity?: { [size: string]: number };
};

type CartStateType = { cart: CartItemType[] };

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SIZES: "SIZES",
  SUBMIT: "SUBMIT",
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
  type: string;
  payload?: CartItemType;
  sizes?: string;
};

// type HandleAddToCart = (product: CartItemType) => Promise<void>;

const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload || !action.sizes) {
        throw new Error("action.payload missing in ADD action");
      }
      const { id, product_name, image_url, price, sizes, quantity } =
        action.payload;

      const product = data.products.find((product) => product.id === id);

      if (!product) {
        throw new Error("Product not found");
      }

      // Convert sizes to an array of characters
      const sizesArray = action.sizes.split("");

      // Extract available quantities based on the received sizes
      const availableQuantities: { [key: string]: number } = {};
      for (const size of sizesArray) {
        // Assert the type of product.quantity to have an index signature
        const quantity = (product.quantity as { [key: string]: number })[size];

        if (quantity !== undefined) {
          availableQuantities[size] = quantity;
        }
      }

      console.log("Available quantities:", availableQuantities);

      const itemInCart = state.cart.find((item) => item.id === id);

      console.log("itemIn console" + itemInCart);

      const calculateTotalQuantity = (quantities: {
        [size: string]: number;
      }) => {
        return Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
      };

      const totalCartItemQuantity =
        itemInCart && itemInCart.quantity
          ? calculateTotalQuantity(itemInCart.quantity)
          : 0;

      const newTotalQuantity =
        totalCartItemQuantity + (typeof quantity === "number" ? quantity : 0);

      console.log("newQuant", newTotalQuantity);
      console.log("itemincart");

      // sessionStorage.setItem("cart", JSON.stringify(state));

      const sumAvailableQuantities = Object.values(availableQuantities).reduce((sum, quantity) => sum + quantity, 0);
      if (newTotalQuantity <= sumAvailableQuantities) {
      
        const filteredCart = state.cart.filter((item) => item.id !== id);

        return {
          ...state,
          cart: [
            ...filteredCart,
            { id, product_name, image_url, sizes, price, quantity },
          ],
        };
      } else {
        console.warn("Product quantity not available.");

        return state;
      }

      // const qty: number = itemExists ? itemExists.qty + 1 : 1

      // return { ...state, cart: [ ...filteredCart, {id, name, image, price, qty}]}
    }
    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload missing in REMOVE action");
      }
      const { id } = action.payload;

      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.id !== id
      );

      return { ...state, cart: [...filteredCart] };
    }
    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload missing in QUANTITY action");
      }

      const { id, quantity } = action.payload;

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.id === id
      );

      if (!itemExists) {
        throw new Error("Item must exist in order to update quantity");
      }

      const updatedItem: CartItemType = { ...itemExists, quantity };

      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.id !== id
      );

      return { ...state, cart: [...filteredCart, updatedItem] };
    }
    case REDUCER_ACTION_TYPE.SUBMIT: {
      return { ...state, cart: [] };
    }
    default:
      throw new Error("Unidentified reducer action type");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  const totalItems = state.cart.reduce((previousValue, cartItem) => {
    // Sum up the quantities for each size
    const totalQuantityForItem = Object.values(cartItem.quantity ?? {}).reduce(
      (acc, curr) => acc + curr,
      0
    );
    return previousValue + totalQuantityForItem;
  }, 0);

  const totalPrice = state.cart.reduce((previousValue, cartItem) => {
    // Calculate the total price for each item based on quantities and price
    const totalItemPrice = Object.entries(cartItem.quantity ?? {}).reduce(
      (acc, [size, quantity]) => acc + quantity * cartItem.price,
      0
    );
    return previousValue + totalItemPrice;
  }, 0);

  const formattedTotalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);

  sessionStorage.setItem("item", JSON.stringify(totalItems));
  sessionStorage.setItem("price", JSON.stringify(formattedTotalPrice));

  const cart = state.cart.sort((a, b) => {
    const itemA = Number(a.id);
    const itemB = Number(b.id);
    return itemA - itemB;
  });
  sessionStorage.setItem("cart1", JSON.stringify(cart));
  console.log("why empty" + JSON.stringify(cart));
  console.log("cart conoso" + cart);

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice: formattedTotalPrice, cart };
};


export type UseCartContextType = ReturnType<typeof useCartContext>;

const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: "",
  cart: [],
};

export const CartContext =
  createContext<UseCartContextType>(initCartContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
