"use client";

import NextLink from "next/link";
import Image from "next/image";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useDisclosure,
  useColorModeValue,
  Button,
  Text,
  VStack,
  SimpleGrid,
  MenuList,
  MenuButton,
  Menu,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, PhoneIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export default function AppHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVehiclesOpen, setVehiclesOpen] = React.useState(false);

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box
      as="header"
      bg={bgColor}
      boxShadow="sm"
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1100}
      transition="all 0.3s ease-in-out"
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        {/* ===================== */}
        {/* LEFT SECTION - LOGO */}
        {/* ===================== */}
        <NextLink href="/" passHref>
          <Box cursor="pointer">
            <Image
              src="/assets/logo/logo.png"
              width={150}
              height={50}
              alt="Logo"
              priority
            />
          </Box>
        </NextLink>

        {/* ===================== */}
        {/* DESKTOP NAVIGATION */}
        {/* ===================== */}
        <HStack
          as="nav"
          spacing={6}
          display={{ base: "none", md: "flex" }}
          color={textColor}
          fontWeight="medium"
        >
          {/* Home */}
          <Link
            as={NextLink}
            href="/"
            _hover={{ color: hoverColor }}
            transition="color 0.2s"
          >
            Home
          </Link>

          {/* Vehicles Dropdown */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<ChevronDownIcon />}
              color={textColor}
              _hover={{ color: hoverColor }}
              _expanded={{ color: hoverColor }}
            >
              Vehicles
            </MenuButton>
            <MenuList>
              <MenuItem as={NextLink} href="/vehicles?vehicle_type=trucks">
                Trucks
              </MenuItem>
              <MenuItem as={NextLink} href="/vehicles?vehicle_type=automobile">
                Cars
              </MenuItem>
            </MenuList>
          </Menu>

          {/* About Us */}
          <Link
            as={NextLink}
            href="/about"
            _hover={{ color: hoverColor }}
            transition="color 0.2s"
          >
            About Us
          </Link>

          {/* Contact Us */}
          <Link
            as={NextLink}
            href="/contact"
            _hover={{ color: hoverColor }}
            transition="color 0.2s"
          >
            Contact Us
          </Link>
        </HStack>

        {/* ===================== */}
        {/* CALL BUTTON + MOBILE TOGGLE */}
        {/* ===================== */}
        <HStack spacing={3}>
          <Link
            href="tel:245-6325-3256"
            aria-label="Call Us"
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            bg="brand.500"
            color="white"
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: "brand.600" }}
          >
            <PhoneIcon mr={2} /> Call Us
          </Link>

          {/* Mobile Menu Button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />
        </HStack>
      </Flex>

      {/* ===================== */}
      {/* MOBILE MENU */}
      {/* ===================== */}
      {isOpen && (
        <Box
          pb={4}
          display={{ md: "none" }}
          bg={bgColor}
          boxShadow="sm"
          transition="all 0.3s ease-in-out"
        >
          <Stack as="nav" spacing={4} color={textColor}>
            <Link as={NextLink} href="/" _hover={{ color: hoverColor }} onClick={onClose}>
              Home
            </Link>

            {/* Vehicles Dropdown inside Mobile Menu */}
            <Stack spacing={2} pl={2}>
              <Box fontWeight="semibold">Vehicles</Box>
              <Link as={NextLink} href="/vehicles/trucks" _hover={{ color: hoverColor }} onClick={onClose}>
                Trucks
              </Link>
              <Link as={NextLink} href="/vehicles/cars" _hover={{ color: hoverColor }} onClick={onClose}>
                Cars
              </Link>
            </Stack>

            <Link as={NextLink} href="/about" _hover={{ color: hoverColor }} onClick={onClose}>
              About Us
            </Link>
            <Link as={NextLink} href="/contact" _hover={{ color: hoverColor }} onClick={onClose}>
              Contact Us
            </Link>
            <Link
              href="tel:245-6325-3256"
              bg="brand.500"
              color="white"
              px={3}
              py={2}
              rounded="md"
              _hover={{ bg: "brand.600" }}
              onClick={onClose}
            >
              <PhoneIcon mr={2} /> Call Us
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
