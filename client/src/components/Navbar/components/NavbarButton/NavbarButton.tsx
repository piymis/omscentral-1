import React from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';

interface Props {
  path: string;
  onClick?: () => void | Promise<void>;
  'data-cy'?: string;
}

const NavbarButton: React.FC<Props> = ({
  children,
  path,
  onClick,
  ...rest
}) => {
  const history = useHistory();

  const handleClick = async () => {
    onClick && (await onClick());
    history.push(path);
  };

  return (
    <Button color="inherit" onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};

export default NavbarButton;
