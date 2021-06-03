import {EventHandler, useState} from "react";

export function useForm(initialValues: {[key: string]: string}, submitHandler: (x: any) => void) {
    const [formValues, setFormValues] = useState(initialValues);

    function handleChange(event: any) {
        const target = event.target;
        const value = target.type === "checkbox"? target.checked: target.value;
        const name = target.name;
        setFormValues({...formValues, [name]: value})
    }

    function handleSubmit(e: any){
        e.preventDefault();
        submitHandler(formValues)
    }

    function resetFormValues(data: {[key: string]: string}) {
        setFormValues(data)
    }

    return {formValues, handleChange, handleSubmit, resetFormValues}

}
