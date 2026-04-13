import { useReducer } from "react";
import { useAuth } from "@contexts/AuthContext"; 
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object({
    email: yup.string().email("Неверный формат email").required("Email обязателен"),
    password: yup.string().min(6, "Пароль должен быть не менее 6 символов").required("Пароль обязателен"),
});

const initialState = {
    email: "",
    password: "",
    errors: {},
    loading: false,
    attempts: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "SET_ERRORS":
            return { ...state, errors: action.errors };
        case "SET_LOADING":
            return { ...state, loading: action.loading };
        case "INCREMENT_ATTEMPTS":
            return { ...state, attempts: state.attempts + 1 };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export const useLoginForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleChange = (field, value) => dispatch({ type: "SET_FIELD", field, value });

    const handleSubmit = async () => {
        try {
            await schema.validate({ email: state.email, password: state.password }, { abortEarly: false });
            dispatch({ type: "SET_ERRORS", errors: {} });
        } catch (err) {
            const errors = {};
            err.inner.forEach((e) => {
                errors[e.path] = e.message;
            });
            dispatch({ type: "SET_ERRORS", errors });
            return;
        }

        dispatch({ type: "SET_LOADING", loading: true });

        const result = await login(state.email, state.password);

        if (result.success) {
            navigate('/profile');
        } else {
            dispatch({
                type: "SET_ERRORS",
                errors: { general: result.error }
            });
        }

        dispatch({ type: "SET_LOADING", loading: false });
    };

    return { state, handleChange, handleSubmit };
};