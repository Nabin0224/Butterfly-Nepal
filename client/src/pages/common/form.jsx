import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { current } from "@reduxjs/toolkit";

// import { useState } from "react";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Check, X } from "lucide-react";

const CustomSelect = ({ getControlItem, value, setFormData, formData }) => {
  const [open, setOpen] = useState(false);
  const isMultiple = getControlItem.multiple || false;

  const handleSelect = (val) => {
    if (isMultiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(val)
        ? currentValues.filter((v) => v !== val)
        : [...currentValues, val];

      setFormData({
        ...formData,
        [getControlItem.name]: newValues,
      });
    } else {
      setFormData({
        ...formData,
        [getControlItem.name]: val,
      });
      setOpen(false);
    }
  };

  const displayLabel = () => {
    if (isMultiple) {
      if (!value || value.length === 0) return `Select ${getControlItem.label}`;
      return value.join(", ");
    }
    const selected = getControlItem.options.find((opt) => opt.id === value);
    return selected ? selected.label : `Select ${getControlItem.label}`;
  };

  const removeSelected = (val) => {
    const filtered = value.filter((v) => v !== val);
    setFormData({
      ...formData,
      [getControlItem.name]: filtered,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Select Box */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full border border-gray-600 px-3 py-2 text-left rounded-md bg-white"
          >
            {displayLabel()}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${getControlItem.label}...`} />
            <CommandList>
              {getControlItem.options.map((option) => {
                const selected = isMultiple
                  ? value?.includes(option.id)
                  : value === option.id;

                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{option.label}</span>
                    {selected && <Check className="w-4 h-4 text-blue-500" />}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Chips (for multiple select only) */}
      {isMultiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((v) => (
            <span
              key={v}
              className="px-2 py-1 text-sm bg-gray-200 rounded-full flex items-center gap-1"
            >
              {v}
              <button
                type="button"
                onClick={() => removeSelected(v)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};



// const CustomSelect = ({ getControlItem, value, setFormData, formData }) => {
//   const [open, setOpen] = useState(false);
//   const isMultiple = getControlItem.multiple || false;

 

//   const handleSelect = (val) => {
//     if(isMultiple) {
//       console.log("value in handleSelect", value)
//       const currentvalues = Array.isArray(value) ? value : [];
//       const newValues = currentvalues.includes(val)
//       ? currentvalues.filter((v) => v !== val)
//       : [...currentvalues, val];

//       setFormData({
//         ...formData,
//         [getControlItem.name] : newValues,
//       })
//     } else {
//     setFormData({
//       ...formData,
//       [getControlItem.name]: val,
//     });
//     setOpen(false);
//   };
// }
//   console.log(getControlItem.name)
//   console.log("formDAta address", formData)

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <button className="w-full border border-gray-600 px-3 py-2 text-left">
//           {value
//             ? getControlItem.options.find((o) => o.id === value)?.label
//             : getControlItem.label}
//         </button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder={`Search ${getControlItem.label}...`} />
//           <CommandList>
//             {getControlItem.options.map((optionItem) => (
//               <CommandItem
//                 key={optionItem.id}
//                 onSelect={() => handleSelect(optionItem.id)}
//               >
//                 {optionItem.label}
//               </CommandItem>
//             ))}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };


function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  setCurrentSelectedAddressInfo,
}) {
  useEffect(() => {
    const freeZoneCities = ["kathmandu", "lalitpur", "bhaktapur", "kirtipur"];
    if (formData.city) {
      setFormData((prev) => ({
        ...prev,
        deliveryCharge: freeZoneCities.includes(formData.city.toLowerCase()) ? 100 : 150,
      }));
    }
  }, [formData.city]);
  
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
          // Check if this is the phone input
  if (getControlItem.name === "phone") {
    element = (
      <Input
        className="border-gray-600 focus:border-blue-400 focus:outline-none"
        name={getControlItem.name}
        placeholder={getControlItem.placeholder}
        id={getControlItem.name}
        type="text" // Use text to prevent scroll arrows
        value={value}
        maxLength={10}
        minLength={10} // limit max 10 digits
        onChange={(event) => {
          const onlyDigits = event.target.value.replace(/\D/g, ""); // remove non-digits
          setFormData({
            ...formData,
            [getControlItem.name]: onlyDigits,
          });
        }}
        onWheel={(e) => e.target.blur()} // prevent trackpad scroll changing value
      />
    );
  } 
     else {   element = (
          <Input
            className=" border-gray-600 focus:border-blue-400 focus:outline-none"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
      }
        break;

      // case "select":
      //   element = (
      //     <Select
      //       className=" border-gray-600 focus:border-blue-400 focus:outline-none"
      //       onValueChange={(value) =>
      //         setFormData({
      //           ...formData,
      //           [getControlItem.name]: value,
      //         })
      //       }
      //       value={value}
      //     >
      //       <SelectTrigger className="w-full">
      //         <SelectValue placeholder={getControlItem.label} />
      //       </SelectTrigger>
      //       <SelectContent>
      //         {getControlItem.options.map((optionItem) => (
      //           <SelectItem key={optionItem.id} value={optionItem.id}>
      //             {optionItem.label}
      //           </SelectItem>
      //         ))}
      //       </SelectContent>
      //     </Select>
      //   );
      //   break;

      case "select":
        element = (
          <CustomSelect
            getControlItem={getControlItem}
            value={value}
            setFormData={setFormData}
            formData={formData}
          />
        );
        break;
      case "textarea":
        element = (
          <Textarea
            className=" border-gray-600 focus:border-blue-400 focus:outline-none"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "color-quantity":
        element = (
          <div className="flex flex-col gap-2">
            {/* Dropdown to Select Colors */}
            <Select
              className=" border-gray-600 focus:border-blue-400 focus:outline-none"
              onValueChange={(selectedColorId) => {
                const selectedColor = getControlItem.options.find(
                  (color) => color.id === selectedColorId
                );

                if (
                  selectedColor &&
                  !formData.colors.some(
                    (c) => c.colorName === selectedColor.label
                  )
                ) {
                  setFormData({
                    ...formData,
                    colors: [
                      ...(formData.colors || []),
                      {
                        colorName: selectedColor.label,
                        code: selectedColor.code,
                        quantity: "",
                      },
                    ],
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                {/* <SelectValue placeholder="Select Color" /> */}
                <span>Select Color</span>
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                      ></span>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* List of Selected Colors with Quantity Input */}
            {formData.colors.length > 0 &&
              formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border p-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code }}
                    ></span>
                    <span className="font-semibold">{color.colorName}</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={color.quantity}
                    onChange={(event) => {
                      const newColors = [...formData.colors];
                      newColors[index].quantity =
                        parseInt(event.target.value, 10) || 0;
                      setFormData({ ...formData, colors: newColors });
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        colors: formData.colors.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;
