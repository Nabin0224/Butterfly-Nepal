import React from "react";
import { filterOptions } from "@/config/index";
import { Fragment } from "react";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "../ui/checkbox";

const ProductFilter = ({ filters, handleFilter }) => {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="md:p-4 p-2 border-b">
        <h2 className="font-extrabold text-md">Filters</h2>
      </div>
      <div className="md:p-4 md:space-y-4">
        {Object.keys(filterOptions).filter(keyItem => keyItem.label !== "No Brand").map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="mb-4 md:mb-10">
              <h3 className="font-medium md:font-bold text-sm md:text-sm p-2">{keyItem}</h3>
              <div className="text-xs md:text-lg flex gap-6 md:grid md:gap-2 mt-2 border-b mb-2 p-2">
                {filterOptions[keyItem].filter(item => item.label !== "No Brand").map((options) => (
                  <Label key={options.id} className="flex items-center gap-1 text-muted-foreground">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] && filters[keyItem].indexOf(options.id) > -1
                      }
                      onCheckedChange={ () => handleFilter(keyItem, options.id)}
                    />
                    {options.label}
                  </Label>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
