import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const CustomSelect = ({ getControlItem, value, setFormData, formData }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    setFormData({
      ...formData,
      [getControlItem.name]: val,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full border border-gray-600 px-3 py-2 text-left">
          {value
            ? getControlItem.options.find((o) => o.id === value)?.label
            : getControlItem.label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${getControlItem.label}...`} />
          <CommandList>
            {getControlItem.options.map((optionItem) => (
              <CommandItem key={optionItem.id} onSelect={() => handleSelect(optionItem.id)}>
                {optionItem.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.name === "phone") {
          return (
            <Input
              className="border-gray-600 focus:border-blue-400 focus:outline-none"
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type="text"
              value={value}
              maxLength={10}
              minLength={10}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, [getControlItem.name]: onlyDigits });
              }}
            />
          );
        }

        return (
          <Input
            className="border-gray-600 focus:border-blue-400 focus:outline-none"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );

      case "select":
        return (
          <CustomSelect
            getControlItem={getControlItem}
            value={value}
            setFormData={setFormData}
            formData={formData}
          />
        );

      case "textarea":
        return (
          <Textarea
            className="border-gray-600 focus:border-blue-400 focus:outline-none"
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
            required={getControlItem.name !== "nearest_landmark"}
          />
        );

      default:
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
    }
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