import Carousel from "react-multi-carousel";
import { CatrgoryIcon } from "../../../../utility/iconsLibrary";

const StoreCategoriesList = ({ categories, onCategorySelected }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      paritialVisibilityGutter: 0,
    },
    tablet: {
      breakpoint: { max: 1023, min: 768 },
      items: 3,
      paritialVisibilityGutter: 0,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 3,
      paritialVisibilityGutter: 0,
    },
  };

  return (
    <div className="rewardCategoryCarousel">
      <Carousel responsive={responsive} autoPlay={false}>
        <div
          className="rewardCategoryButton"
          onClick={() => onCategorySelected("all")}
        >
          <CatrgoryIcon />
          All
        </div>
        {categories?.map((item, idx) => (
          <div
            className="rewardCategoryButton"
            onClick={() => onCategorySelected(item?.categoryCode)}
            key={idx}
          >
            <CatrgoryIcon />
            {item?.categoryName}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default StoreCategoriesList;
