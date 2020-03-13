export const resizeImage = ({
  baseImageWidth,
  baseImageHeight,
  idealSquarePart,
}) => {
  let width = baseImageWidth;
  let height = baseImageHeight;

  if (baseImageWidth < idealSquarePart && baseImageHeight < idealSquarePart) {
    return {
      width,
      height,
    };
  }

  if (baseImageWidth === baseImageHeight) {
    return {
      width: idealSquarePart,
      height: idealSquarePart,
    };
  }

  if (baseImageWidth > idealSquarePart && baseImageWidth > baseImageHeight) {
    width = idealSquarePart;
    height = (baseImageHeight / baseImageWidth) * idealSquarePart;
  }

  if (baseImageHeight > idealSquarePart && baseImageWidth < baseImageHeight) {
    height = idealSquarePart;
    width = (baseImageWidth / baseImageHeight) * idealSquarePart;
  }

  return {
    width,
    height,
  };
};

export const getDescribedSquareSizes = size => {
  const val = size * Math.sqrt(2);

  return {
    width: val,
    height: val,
    borderRadius: val / 2,
  };
};

export const clamp = (val, min, max) => {
  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
};
