import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const CommonInputField = ({ 
    type = "text", 
    placeholder, 
    name, 
    value, 
    onChange, 
    icon, 
    isRequired = false 
}) => {
    return (
        <Form.Group className="mb-3">
            <InputGroup>
                {icon && (
                    <InputGroup.Text>
                        {icon}
                    </InputGroup.Text>
                )}
                <Form.Control
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={isRequired}
                />
            </InputGroup>
        </Form.Group>
    );
};

export default CommonInputField;
