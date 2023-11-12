import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";
import ProductCard from "./ProductCard";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const [videosList, setVideosList] = useState([]);
  const [products, setProducts] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const [timerId,udpateTimerId]=useState("");
  const [userToken,setUserToken]=useState()
  const [prod, setProd] = useState([]);

  const performAPICall = async () => {
    setLoad(true);
    try {
      let url = `${config.endpoint}/products`;

      let res = await axios.get(url);
      let videos = res.data;
      setProducts(videos);
      setVideosList(videos);
    } catch (error) {
      enqueueSnackbar(
        "Something went wrong! Seems like backend is not running",
        { variant: "error" }
      );
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let url = `${config.endpoint}/products/search?value=${text}`;

      let res = await axios.get(url);
      let vid = res.data;
      setVideosList(vid);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setVideosList([]);
        }
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          //setVideosList(products);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong! Seems like backend is not running",
          { variant: "error" }
        );
      }
    }
  };

  /* useEffect(()=>{
    performSearch(search)
  },[search])*/

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
   const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    // wait for 500 ms and make a call
    // 1st request
    let timerId = setTimeout(() => performSearch(event), 500);
    udpateTimerId(timerId);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token || !products) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const cartUrl=config.endpoint+'/cart';
      // const header=`Authorization: Bearer ${token}`;
      const cardDataItems=await axios.get(cartUrl,{headers:{Authorization:`Bearer ${token}`}});
      console.log(cardDataItems);
      const cartItem=generateCartItemsFrom(cardDataItems.data,products);
      console.log(cartItem);
      setProd(cartItem);

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token)
    { 
      fetchCart(token);
      setUserToken(token);
    }
 
  },[products])

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++)
    {
      if(items[i]['_id']===productId)
      {
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
        return true;

      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(options.preventDuplicate)
    if(options.preventDuplicate===true)
    {
      try{
    let cartUrl=config.endpoint+'/cart';
    let response=await axios.post(cartUrl,{"productId":productId,"qty":qty},{headers:{Authorization:`Bearer ${token}`}});
    const data=await generateCartItemsFrom(response.data,products);
    console.log("Response");
    console.log(data);
    setProd(data);
      }
      catch(e){
          console.error(e);
      }
    }
    else{
      console.log("entererd");
      console.log(items);
      let index;
      for(let i=0;i<items.length;i++){
        if(items[i]['_id']===productId){
          index=i;
        }
      }
      if(options.preventDuplicate==='+'){
        items[index]['qty']++;
      }
      else{
          items[index]['qty']--;
      }
      //  udpate ite4ms
      let url=config.endpoint+'/cart';
      let res=await axios.post(url,{"productId":productId,"qty":items[index]["qty"]},{headers:{Authorization:`Bearer ${token}`}});
      const cartData=await generateCartItemsFrom(res.data,products)
      setProd(cartData);
    }

    
  };
  let addItems=(e)=>{
    console.log(e)
    if(!userToken){
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"}) }
    else {
      let result=isItemInCart(prod,e.target.value);
      console.log(result);
      if(!result){
        addToCart(userToken,prod,products,e.target.value,1,{preventDuplicate: true});
      }else{
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
      }
    }
    
    
  }
  
  const onButtonClick=(id,handle)=>{
    console.log("Button Click");
    console.log(id,handle);
    addToCart(userToken,prod,products,id,null,{preventDuplicate: handle })
  }
  return (
    <div>
      <Header  hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        onChange={(e)=>{debounceSearch(e.target.value,timerId)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <div className="main-container">
        <div className="sub-container">
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>

      {load ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
          <h6>Loading Products...</h6>
        </Box>
      ) : videosList.length > 0 ? (
        <Grid container spacing={3} sx={{ pt: "15px" }}>
          {videosList.map((video) => (
            <Grid item xs={6} md={3} key={video._id}>
              <ProductCard product={video} key={video._id}  handleAddToCart={(e)=>addItems(e)}/>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          style={{ height: "500px" }}
        >
          <SentimentDissatisfied />
          <Typography variant="body2" color="text.secondary">
            'No Products Found'
          </Typography>
        </Box>
      )}</div>
      <div className="cart">
        <Cart  products={prod} items={products} handleQuantity={onButtonClick} hasCheckoutButton />
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
