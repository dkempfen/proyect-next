// src/context/CategoryContext.js
import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const selectCategory = (categoryId) => {
    setCategory(categoryId);
    setSubCategory(""); // Reset subCategory when changing category
  };

  const selectSubCategory = (subCategoryId) => {
    setSubCategory(subCategoryId);
  };

  return (
    <CategoryContext.Provider
      value={{
        category,
        subCategory,
        selectCategory,
        selectSubCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
