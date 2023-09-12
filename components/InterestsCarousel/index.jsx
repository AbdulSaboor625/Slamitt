import { Checkbox, Form, Image, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { getCategories } from "../../requests/category";
import { notify } from "../../Redux/Actions";

const InerestsCarousel = ({
  competition,
  responsive,
  className,
  selected,
  itemOuterContainerClass,
  setCategoriesSelected,
  setCategoryCount,
  categoryCount,
  profileInterest,
  from = "",
}) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef(null);
  const [subCategories, setSubCategories] = useState([]);
  const [modCategories, setModCategories] = useState(categories);
  const [parentCatgeory, setParentCategory] = useState([]);
  const [run, setRun] = useState(false);
  const [previousSelected, setPreviousSelected] = useState(
    categories[0]?.categoryCode
  );
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    setModCategories(categories);
  }, [categories]);

  useEffect(() => {
    async function fetchData() {
      const categories = await getCategories();
      if (categories) {
        if (from === "PROFILE") {
          const cats = categories.map((element) => {
            if (element?.categoryCode !== "other") return element;
          });
          setCategories([...cats.filter((item) => item !== undefined)]);
        } else setCategories([...categories]);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (
      competition &&
      competition.categoryArray &&
      competition.categoryArray.length
    ) {
      categories.forEach((element) => {
        if (element.categoryCode === competition.category.categoryCode) {
          setSubCategories([...element.subCategory]);
          setPreviousSelected(element.categoryCode);
          element.isSelected = true;
          element.subCategory.forEach((subElement) => {
            if (
              competition.categoryArray.includes(
                subElement.categoryNameSubCategoryNameCode
              )
            ) {
              subElement.isSelected = true;
            }
          });
        }
      });
      setModCategories([...categories]);
    }
  }, [
    competition &&
      competition.category &&
      competition.categoryArray &&
      competition.categoryArray.length,
  ]);

  useEffect(() => {
    if (profileInterest) {
      let newArray = modCategories
        .map((cat) => {
          return cat.subCategory.filter((sub) => {
            if (selected.includes(sub.categoryNameSubCategoryNameCode))
              return sub.categoryNameSubCategoryNameCode;
          });
        })
        .filter((arr) => !!arr.length);
      let combinedArray = [].concat(...newArray);
      setParentCategory(combinedArray.map((arr) => arr.categoryCode));
    }
  }, [modCategories]);

  useEffect(() => {
    if (selected && !!categories.length && !run) {
      categories.forEach((element) => {
        element?.subCategory?.forEach((scat) => {
          const scategory = selected.find((item) => {
            return scat?.categoryNameSubCategoryNameCode === item;
          });
          if (scategory) {
            scat.isSelected = true;
            element.isSelected = true;
          }
        });
      });
      setModCategories([...categories]);

      let newArray = categories
        .map((cat) => {
          return cat.subCategory.filter((sub) => {
            if (selected.includes(sub.categoryNameSubCategoryNameCode))
              return sub.categoryNameSubCategoryNameCode;
          });
        })
        .filter((arr) => !!arr.length);
      let combinedArray = [].concat(...newArray);
      const previous = combinedArray.map((arr) => arr.categoryCode);
      setPreviousSelected(previous[0]);
      setRun(true);
    }
  }, [selected, categories]);

  const onCategorySelected = (e) => {
    const selectedCategories = JSON.parse(JSON.stringify(e.subCategory));
    setSubCategories([...selectedCategories]);
    if (!subCategories.length) {
      setPreviousSelected(selectedCategories[0]?.categoryCode);
    }
  };

  useEffect(() => {
    if (profileInterest || !!selected?.length) {
      categories?.forEach((cat, idx) =>
        cat?.subCategory.forEach((scat) => {
          if (scat?.categoryNameSubCategoryNameCode === selected[0]) {
            setSubCategories([...cat.subCategory]);
          }
        })
      );
    }
  }, [categories]);

  const onSubCategorySelected = (e) => {
    if (profileInterest) {
      const value = JSON.parse(e.target.value);

      // if (value.categoryCode === previousSelected) {
      if (e.target.checked) {
        setCategoryCount((count) => count + 1);
        categories.forEach((element) => {
          if (element.categoryCode === value.categoryCode) {
            element.isSelected = true;
            element.subCategory.forEach((subElement) => {
              if (
                subElement.categoryNameSubCategoryNameCode ===
                value.categoryNameSubCategoryNameCode
              ) {
                subElement.isSelected = true;
              }
            });
          }
        });
      } else {
        setCategoryCount((count) => count - 1);

        categories.forEach((element) => {
          if (element.categoryCode === value.categoryCode) {
            element.subCategory.forEach((subElement) => {
              if (
                subElement.categoryNameSubCategoryNameCode ===
                value.categoryNameSubCategoryNameCode
              ) {
                subElement.isSelected = false;
              }
            });
          }
        });
        categories.forEach((element) => {
          if (element.isSelected) {
            let flag = 0;
            element.subCategory.forEach((subElement) => {
              if (!subElement.isSelected) {
                flag += 1;
              }
            });
            if (flag === element.subCategory.length) {
              element.isSelected = false;
            }
          }
        });
      }

      setModCategories([...categories]);
      const codes = [];
      categories.forEach((element) => {
        element.subCategory.forEach((subElement) => {
          if (subElement.isSelected) {
            codes.push(subElement.categoryNameSubCategoryNameCode);
          }
        });
      });
      setCategoriesSelected(codes);
      // }
      // } else {
      //   if (value.categoryCode !== previousSelected) {
      //     categories.forEach((element) => {
      //       if (element.categoryCode === value.categoryCode) {
      //         element.isSelected = true;
      //         element.subCategory.forEach((subElement) => {
      //           if (
      //             subElement.categoryNameSubCategoryNameCode ===
      //             value.categoryNameSubCategoryNameCode
      //           ) {
      //             subElement.isSelected = true;
      //           }
      //         });
      //       }
      //     });
      //   }
      //   categories.forEach((element) => {
      //     if (element.categoryCode === previousSelected) {
      //       element.isSelected = false;
      //       element.subCategory.forEach((subElement) => {
      //         subElement.isSelected = false;
      //       });
      //     }
      //   });
      //   setPreviousSelected(value.categoryCode);
      //   setModCategories([...categories]);
      // }
    } else {
      const value = JSON.parse(e.target.value);
      if (value.categoryCode === previousSelected) {
        if (e.target.checked) {
          categories.forEach((element) => {
            if (element.categoryCode === value.categoryCode) {
              element.isSelected = true;
              element.subCategory.forEach((subElement) => {
                if (
                  subElement.categoryNameSubCategoryNameCode ===
                  value.categoryNameSubCategoryNameCode
                ) {
                  subElement.isSelected = true;
                }
              });
            }
          });
        } else {
          categories.forEach((element) => {
            if (element.categoryCode === value.categoryCode) {
              element.subCategory.forEach((subElement) => {
                if (
                  subElement.categoryNameSubCategoryNameCode ===
                  value.categoryNameSubCategoryNameCode
                ) {
                  subElement.isSelected = false;
                }
              });
            }
          });
          categories.forEach((element) => {
            if (element.isSelected) {
              let flag = 0;
              element.subCategory.forEach((subElement) => {
                if (!subElement.isSelected) {
                  flag += 1;
                }
              });
              if (flag === element.subCategory.length) {
                element.isSelected = false;
              }
            }
          });
        }
        setModCategories([...categories]);

        const codes = [];
        categories.forEach((element) => {
          element.subCategory.forEach((subElement) => {
            if (subElement.isSelected) {
              codes.push(subElement.categoryNameSubCategoryNameCode);
            }
          });
        });
        setCategoriesSelected(codes);
      } else {
        categories.forEach((element) => {
          if (element.categoryCode === previousSelected) {
            element.isSelected = false;
            element.subCategory.forEach((subElement) => {
              subElement.isSelected = false;
            });
          }
        });

        if (value.categoryCode !== previousSelected) {
          categories.forEach((element) => {
            if (element.categoryCode === value.categoryCode) {
              element.isSelected = true;
              element.subCategory.forEach((subElement) => {
                if (
                  subElement.categoryNameSubCategoryNameCode ===
                  value.categoryNameSubCategoryNameCode
                ) {
                  subElement.isSelected = true;
                }
              });
            }
          });
        }

        setPreviousSelected(value.categoryCode);
        setModCategories([...categories]);
        const codes = [];
        codes.push(value.categoryNameSubCategoryNameCode);
        setCategoriesSelected(codes);
      }
    }
  };

  const isExist = (sub) => {
    const find = selected.filter(
      (item) => item === JSON.parse(sub).categoryNameSubCategoryNameCode
    );
    if (!!find.length) {
      return true;
    } else {
      return false;
    }
  };

  const [activeIndex, setActiveIndex] = useState();

  return (
    <>
      <Carousel
        ref={carouselRef}
        className={className}
        // partialVisbile={true}
        deviceType={"desktop"}
        itemClass="image-item"
        responsive={responsive}
        autoPlay={false}
        shouldResetAutoplay={false}
        // centerMode={true}
        // beforeChange={(nextSlide, { currentSlide, onMove }) => {
        //   carouselRef.current.goToSlide(currentSlide);
        // }}
        // focusOnSelect={true}
      >
        {modCategories.map((item, index) => (
          <label
            key={index}
            className={`${itemOuterContainerClass} ${
              parentCatgeory.includes(item.categoryCode) ||
              activeIndex === index
                ? "active"
                : ""
            }`}
            style={{
              background: `${
                item?.colorCode === "#000"
                  ? item?.colorCode
                  : `linear-gradient(${item?.colorCode})`
              }`,
            }}
            onClick={() => {
              onCategorySelected(item);
              setActiveIndex(index);
            }}
          >
            {item?.imageUrl && (
              <Image
                preview={false}
                src={item?.imageUrl}
                height={100}
                width={100}
                alt="categories"
              />
            )}
            <Typography.Title className="personaliseCategoriesTitle" level={4}>
              {item?.categoryName}
            </Typography.Title>
            {item?.isSelected && (
              <Checkbox
                key={item?.categoryCode}
                value={item?.categoryCode}
                checked={item?.isSelected}
              />
            )}
          </label>
        ))}
      </Carousel>
      <Form.Item className="checkboxCustom">
        {subCategories.map((item) => (
          <div
            className="checkboxCustomItem"
            key={item?.categoryNameSubCategoryNameCode}
            // style={{
            //   background: `linear-gradient(${item.colorCode})`,
            //   padding: "1rem",
            //   margin: "0.5rem",
            //   borderRadius: "3rem",
            // }}
          >
            <input
              // disabled={categoryCount >= 15 && !item.isSelected}
              type="checkbox"
              // className="pinkActive"
              value={JSON.stringify(item)}
              defaultChecked={item?.isSelected}
              onChange={(e) => {
                if (profileInterest) {
                  !isExist(e.target.value)
                    ? categoryCount < 25
                      ? onSubCategorySelected(e)
                      : dispatch(
                          notify({
                            type: "error",
                            message: "Maximum interests have been selected",
                          })
                        )
                    : onSubCategorySelected(e);
                } else {
                  onSubCategorySelected(e);
                }
              }}
              id={item?.categoryNameSubCategoryNameCode}
            />
            <label
              htmlFor={item?.categoryNameSubCategoryNameCode}
              className={`${
                selected &&
                !selected.includes(item.categoryNameSubCategoryNameCode)
                  ? "activeSubCategory"
                  : ""
              }`}
              style={{
                background: `${
                  item?.colorCode === "#000"
                    ? item?.colorCode
                    : `linear-gradient(${item?.colorCode})`
                }`,
              }}
            >
              {item?.subCategoryName}
            </label>
          </div>
        ))}
      </Form.Item>
    </>
  );
};

export default InerestsCarousel;
