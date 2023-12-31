import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  console.log("generate");
  console.log(cartData);
  const cartItems=cartData.map((item)=>{
    let matchingItems=productsData.find((product)=>product._id===item.productId);
  
      if(matchingItems)
      {
        matchingItems.qty=item.qty;
        matchingItems.productId=item._id;
      }

    return matchingItems;
  })
  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let price=0;
  console.log("getTo");
  console.log(items);
  for(let i=0;i<items.length;i++)
  {
    price+=items[i].qty*items[i].cost;
  }
  console.log(price)
  return price;

};

export const getTotalItem= (items =[]) => {
  console.log("sdai",items);
  let quantity=0;
  for(let i=0;i<items.length;i++)
  {
    quantity+=items[i].qty;
  }
  console.log(quantity)
  return quantity;
}
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete,productId,isReadOnly }) => {
  if(isReadOnly)
  {
    return <Box>Qty:{value}</Box>;
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={(e)=>{handleDelete(productId,'-')}}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={(e)=>{handleDelete(productId,'+')}}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

const Cart = ({ products, items = [], handleQuantity,hasCheckoutButton=false,isReadOnly=false }) => {
  const userToken=localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  }
  if(!userToken)
  {
    return null;
  }
  // console.log("sd",products,items);
  if (!products.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
 
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {
        products.map((item,index) => 
        (
       <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
    <Box className="image-container">
        <img
       
            src={item.image}
            // Add product name as alt eext
            alt=""
            width="100%"
            height="100%"
        />
    </Box>
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
    >
        <div>{item.name}</div>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
        <ItemQuantity
        // Add required props by checking implementation
        value={item.qty} handleAdd={ handleQuantity}  handleDelete={handleQuantity} productId={item._id} isReadOnly={isReadOnly}
        />
        <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
        </Box>
        </Box>
    </Box>
       </Box>)
        ) }
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(products)}
          </Box>
        </Box>
    
        {hasCheckoutButton && (<Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleCheckout}
            className="checkout-btn"
          >
            Checkout
          </Button>
        </Box>)}
      </Box>
     
    </>
  );
};

export default Cart;
