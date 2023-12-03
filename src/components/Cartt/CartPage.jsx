import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartsCollectionRef = collection(db, 'Sample');
        const snapshot = await getDocs(cartsCollectionRef);

        const cartItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCart(cartItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    try {
      const cartItemRef = doc(db, 'Sample', itemId);
      await deleteDoc(cartItemRef);
      alert('Item deleted from cart!');

      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const handleIncrementQuantity = async (itemId) => {
    try {
      const cartItemRef = doc(db, 'Sample', itemId);
      await updateDoc(cartItemRef, {
        quantity: (cart.find((item) => item.id === itemId)?.quantity || 1) + 1,
      });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      );
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrementQuantity = async (itemId) => {
    try {
      const currentQuantity = cart.find((item) => item.id === itemId)?.quantity || 1;

      if (currentQuantity > 1) {
        const cartItemRef = doc(db, 'Sample', itemId);
        await updateDoc(cartItemRef, {
          quantity: currentQuantity - 1,
        });

        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === itemId ? { ...item, quantity: currentQuantity - 1 } : item
          )
        );
      }
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const total = cart.reduce((acc, item) => {
    // Parse the price as a float, and use 0 if it's not a valid number
    const itemPrice = parseFloat(item.price) || 0;
    return acc + itemPrice * (item.quantity || 1);
  }, 0);

  return (
    <div className="container mx-auto my-8 p-4 bg-white shadow-md">
      <h2 className="text-3xl font-semibold mb-4">Shopping Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cart.map((item) => (
          <div key={item.id} className="bg-gray-100 p-4 rounded-md shadow-md">
            <img src={item.ImageBook} alt="book" className="h-32 object-cover mb-4" />
            <p className="text-lg font-semibold mb-2">{item.title}</p>
            <p className="text-gray-600 mb-2">Price: {item.price} {'រៀល'}</p>
            <p className="text-gray-600 mb-2">Quantity: {item.quantity || 1}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleIncrementQuantity(item.id)}
                className="bg-green-500 hover:bg-green-700 active:bg-blue-800
                text-white font-bold py-2 px-4 rounded"
              >
                Increment
              </button>
              <button
                onClick={() => handleDecrementQuantity(item.id)}
                className="bg-yellow-500 hover:bg-yellow-700 active:bg-blue-800
                text-white font-bold py-2 px-4 rounded"
              >
                Decrement
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 hover:bg-red-700 text-white active:bg-blue-800
                font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xl font-semibold mt-4">Total Price: {total.toFixed(2)} {'រៀល'}</p>
    </div>
  );
};

export default CartPage;
