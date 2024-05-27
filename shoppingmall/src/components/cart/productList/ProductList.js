import styled from "styled-components";
import { useState } from "react";

// assets
import checkbox from "../../../assets/checkbox.svg";
import checkedbox from "../../../assets/checkedbox.svg";
// components
import Info from "./Info";
import Count from "./Count";
import OrderAmount from "./OrderAmount";

const ProductList = ({ cartItems, setCartItems, onDeleteItem, onOrder }) => {
  const [count, setCount] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.cartItemId] = item.quantity;
      return acc;
    }, {})
  );

  const toggleCheck = id => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cart_item_id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const updateCount = (id, newCount) => {
    setCount(prevCounts => ({
      ...prevCounts,
      [id]: newCount,
    }));

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === id ? { ...item, quantity: newCount } : item
      )
    );
  };

  return (
    <>
      {cartItems.map(product => {
        const totalPrice = product.price * product.quantity;

        return (
          <Container key={product.cartItemId}>
            <Wrapper>
              <Checkbox
                onClick={() => toggleCheck(product.cartItemId)}
                checked={product.checked}
              >
                {product.checked ? (
                  <Icon src={checkedbox} />
                ) : (
                  <Icon src={checkbox} />
                )}
              </Checkbox>
              <Info product={product} onDeleteItem={onDeleteItem} />
              <Count
                quantity={product.quantity}
                onUpdateCount={newCount =>
                  updateCount(product.cartItemId, newCount)
                }
                disabled={product.soldOut}
              />
              <OrderAmount
                product={product}
                totalPrice={totalPrice}
                onOrder={onOrder}
              />
            </Wrapper>
          </Container>
        );
      })}
    </>
  );
};

export default ProductList;

const Container = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Checkbox = styled.div`
  width: 6%;
  display: flex;
  justify-content: center;
`;

const Icon = styled.img`
  width: 20px;
  cursor: pointer;
`;
