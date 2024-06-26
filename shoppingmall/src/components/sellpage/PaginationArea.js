import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LeftArrowIcon from "../../assets/leftarrow.svg";

const PaginationArea = ({
  currentPageNum,
  size,
  sort,
  pageNum,
  Filerender,
  ListData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);

  const maxPages = 8;

  const totalPages = maxPages; // 총 페이지 수

  const onPageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page);
      console.log(`Page changed to ${page}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (startPage < 1) {
      startPage = 1;
      endPage = 5;
    } else if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - 4;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          onClick={() => onPageChange(i)}
          isActive={currentPage === i}
        >
          {i}
        </PageButton>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (pageNum == 1) {
      const fetchData = () => {
        const token = localStorage.getItem("login-token");
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("size", maxPages);
        params.append("sort", "asc");

        const url = `${
          process.env.REACT_APP_API_URL
        }/product?${params.toString()}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error("상품 정보를 가져오는데 실패했습니다.");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);

            // data.products가 배열인지 확인하고 배열이 아닌 경우 빈 배열로 처리
            const products = Array.isArray(data.products) ? data.products : [];

            const newData = products.map((item) => ({
              files: item.imageBase64
                ? `data:image/jpeg;base64,${item.imageBase64}`
                : "",
              title: item.productName || "No Title",
              price: item.price || 0,
              description: item.description || "No Description",
              startDate: item.startDate || "No Start Date",
              endDate: item.endDate || "No End Date",
              stock: item.stock || 0,
              productId: item.productId || "No Product ID",
            }));

            ListData(newData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      fetchData();
    } else if (pageNum == 2) {
      const fetchData = () => {
        const token = localStorage.getItem("login-token");
        const userId = localStorage.getItem("user_Id");
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("size", maxPages);
        params.append("sort", "asc");


        const url = `${
          process.env.REACT_APP_API_URL
        }/products/user/${userId}?${params.toString()}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error("상품 정보를 가져오는데 실패했습니다.");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);

            // data.products가 배열인지 확인하고 배열이 아닌 경우 빈 배열로 처리
            const products = Array.isArray(data.products) ? data.products : [];

            // Base64 이미지 데이터를 이미지 URL로 변환하여 상태에 저장
            const imagesArray = products.map((item) => ({
              imageUrl: item.imageBase64
                ? `data:image/jpeg;base64,${item.imageBase64}`
                : "",
              alt: item.productName || "No Title",
            }));
            setImages(imagesArray);

            const newData = products.map((item) => ({
              files: item.imageBase64
                ? `data:image/jpeg;base64,${item.imageBase64}`
                : "",
              title: item.productName || "No Title",
              price: item.price || 0,
              description: item.description || "No Description",
              startDate: item.startDate || "No Start Date",
              endDate: item.endDate || "No End Date",
              stock: item.stock || 0,
              productId: item.productId || "No Product ID",
            }));

            Filerender(newData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      fetchData();
    }
  }, [currentPage, maxPages]);

  return (
    <Wrapper>
      <PaginationContainer>
        <PageButton
          onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
        >
          <ArrowIcon src={LeftArrowIcon} alt="Previous" />
        </PageButton>
        {renderPageNumbers()}
        <PageButton
          onClick={() =>
            onPageChange(
              currentPage + 1 <= totalPages ? currentPage + 1 : totalPages
            )
          }
        >
          <ArrowIcon src={LeftArrowIcon} alt="Next" flipped />
        </PageButton>
      </PaginationContainer>
    </Wrapper>
  );
};

export default PaginationArea;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 90px;
`;

const PageButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px;
  background-color: ${(props) => (props.isActive ? "black" : "#f4f4f4")};
  color: ${(props) => (props.isActive ? "white" : "#858585")};
  cursor: pointer;

  &:hover {
    background-color: black;
    color: ${(props) => props.theme.mainColor};
  }
`;

const ArrowIcon = styled.img`
  width: 7px;
  height: 15px;
  transform: ${(props) => (props.flipped ? "scaleX(-1)" : "none")};
`;

