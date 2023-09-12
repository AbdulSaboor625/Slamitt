import Api from "../../services";

export const getCategories = async () => {
  try {
    const response = await Api.get("/category");
    if (response && response.result) {
      const groupedSubCategories = Object.values(response.result);
      const categories = groupedSubCategories.map((subCategories) => ({
        categoryCode: subCategories[0].categoryCode,
        categoryName: subCategories[0].categoryName,
        colorCode: subCategories[0].colorCode,
        imageUrl: subCategories[0].imageUrl,
        subCategory: [...subCategories],
        label: subCategories[0].categoryName,
        value: JSON.stringify(subCategories),
      }));

      return categories;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (err) {
    return null;
  }
};
