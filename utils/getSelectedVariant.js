export const getSelectedVariant = ({ variants, options }) => {
  if (variants && options) {
    if (options.length === 0) return variants[0];
    else {
      return variants.find((variant) => {
        return options.every((option) => {
          return variant.content.selectedOptions.some((variantOption) => {
            return (
              option.value === variantOption.value &&
              option.name === variantOption.name
            );
          });
        });
      });
    }
  }
};
