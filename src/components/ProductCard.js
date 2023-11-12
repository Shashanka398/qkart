import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart}) => {
  
  return (
    <Card className="card">
      <CardMedia component="img"  alt={product.name} aria-label="img" image={product.image} />
      <CardContent>
      <Typography color="text.primary" variant="h5"  gutterBottom>
            {product.name}
      </Typography>
      <Typography  variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
            ${product.cost}
      </Typography>
      
      <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      
      <Button variant="contained"  startIcon={<AddShoppingCartOutlined/>} value={product._id} onClick={handleAddToCart}>ADD TO CART</Button>
      
    </Card>
  );
};

export default ProductCard;
