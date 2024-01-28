import { useState } from "react";
import { useGeneralStore } from "../stores/generalstore";

import classes from "../Mantinecss/Navbar.module.css";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../graphql/mutations/Logout";
import { Center, Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import {
  IconHome2,
  IconUser,
  IconLogout,
  IconBrandWechat,
  IconLogin,
} from "@tabler/icons-react";

import { useUserStore } from "../stores/userStore";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [{ icon: IconBrandWechat, label: "Chatrooms" }];

function Sidebar() {
  const toggleProfileModal = useGeneralStore(
    (state) => state.toggleProfileSettingsModal
  );
  const [active, setActive] = useState(0);
  const userId = useUserStore((state) => state.id);
  const user = useUserStore((state) => state);
  const setUser = useUserStore((state) => state.setUser);
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      toggleLoginModal();
    },
  });
  const handlelogout = async () => {
    await logoutUser();
    setUser({
      id: undefined,
      fullname: "",
      avatarUrl: null,
      email: "",
    });
  };
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));
  return (
    <nav className={classes.navbar}>
      <Center>
        <IconBrandWechat type="mark" size={30} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {userId && links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {userId && (
          <NavbarLink
            icon={IconUser}
            label={"profile(" + user.fullname + ")"}
            onClick={toggleProfileModal}
          />
        )}
        {userId ? (
          <NavbarLink icon={IconLogout} label="logout" onClick={handlelogout} />
        ) : (
          <NavbarLink
            icon={IconLogin}
            label="Login"
            onClick={toggleLoginModal}
          />
        )}

      </Stack>
    </nav>
  );
}

export default Sidebar;
