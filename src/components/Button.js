import styled from "styled-components";

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 3px;
  font-weight: bold;
  color: #333;
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
`;

export default Button;
