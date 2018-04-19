import styled from "styled-components";

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 2px;
  font-weight: bold;
  color: #253858;
  background: ${({ type }) => {
    if (type === "yellow") {
      return "#FFFAE5";
    } else if (type === "red") {
      return "#FFEBE5";
    } else if (type === "green") {
      return "#E3FCEF";
    } else if (type === "blue") {
      return "#DEEBFF";
    } else if (type === "purple") {
      return "#EAE6FF";
    } else {
      return "none";
    }
  }};
  border: solid 1px #eee;
  border-color: ${({ type }) => {
    if (type === "green") {
      return "#ABF5D1";
    }
  }};
`;

export default Button;
