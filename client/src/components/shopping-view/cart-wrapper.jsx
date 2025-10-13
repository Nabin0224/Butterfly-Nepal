import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import UserCartItemsContent from './cart-items-content';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useSelector } from 'react-redux';
import { trackEvent } from '../../utils/analytics';

const UserCartWrapper = ({ setOpenCartSheet, setOpenMobileCartSheet}) => {
    const  navigate = useNavigate();
    const { cartItems } = useSelector((state)=> state.shoppingCart);

    const safeItems = Array.isArray(cartItems)
      ? cartItems
      : (cartItems && cartItems.items ? cartItems.items : []);

    const totalCartAmount = 
    safeItems && safeItems.length > 0 ? 
    safeItems.reduce(
        (sum, currentItem) => 
             sum + (
        currentItem?.salePrice >  0 ? currentItem.salePrice : currentItem?.price
    ) * currentItem?.quantity, 0  )
    : 0

     
  const handleCheckout = () => {
    // Fire Google Analytics Event
    trackEvent('begin_checkout', {
      currency: 'NPR',
      value: totalCartAmount,
      items: safeItems.map((item) => ({
        item_id: item._id || item.id,
        item_name: item.title,
        item_variant: item.color,
        price: item.salePrice || item.price,
        quantity: item.quantity,
      })),
    });

    // Navigate after event fires
    navigate('/checkout');
    setOpenCartSheet(false);
    setOpenMobileCartSheet(false);
  };



  return <SheetContent className = "w-2/3" >
        <SheetHeader>
            
            <SheetTitle>
                Your Cart
            </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
        <Separator className=" h-[1px] bg-black/35 mt-10"/>
        {safeItems && safeItems.length > 0 
          ? safeItems.map((item) => <UserCartItemsContent cartItem={item} />) 
          : null}
        </div>
        <Separator className=" h-[1px] bg-black/35 mt-14"/>
        <div className="mt-8 space-y-4">
            <div className="flex justify-between">
            <span className='font-bold'>Total</span>
            <span className="font-semibold">Rs{totalCartAmount}</span>
            </div>
        </div>
        <Button onClick={handleCheckout} className="w-full mt-8 ">Checkout</Button>
        
    </SheetContent>
    
  
    
}

export default UserCartWrapper;