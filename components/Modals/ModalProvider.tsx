import AddProductModal from "./AddProductModal";
import ChatModal from "./ChatModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

type Props = {};

function ModalProvider({}: Props) {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <AddProductModal />
      <ChatModal />
    </>
  );
}

export default ModalProvider;
