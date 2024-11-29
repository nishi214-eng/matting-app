import { useNavigate } from 'react-router-dom';

// ナビゲート関数の型を定義
type NavigateFunction = (path: string) => void;

const useButtonNavigation = (): NavigateFunction => {
  const navigate = useNavigate();

  // ナビゲート機能を返す
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return handleNavigation;
};

export default useButtonNavigation;
