"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Container,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { 
  HamburgerIcon, 
  CloseIcon, 
  PhoneIcon, 
  ChevronDownIcon,
  SearchIcon,
  CalendarIcon,
  InfoIcon 
} from "@chakra-ui/icons";
import { 
  FaCar, 
  FaTruck, 
  FaMotorcycle, 
  FaShip, 
  FaUserCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaShieldAlt 
} from "react-icons/fa";
import { FiHeart, FiShoppingCart, FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export default function AppHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams({
        query: searchQuery.trim()
      }).toString();
      
      router.push(`/vehicles?${queryParams}`);
      onClose(); // Close mobile menu if open
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1100}
      transition="all 0.3s ease-in-out"
    >
      {/* Main Navigation */}
      <Container maxW="7xl" py={2}>
        <Flex alignItems="center" justifyContent="space-between">
          {/* ===================== */}
          {/* LEFT SECTION - LOGO */}
          {/* ===================== */}
          <NextLink href="/" passHref>
            <Box cursor="pointer" display="flex" alignItems="center">
              <Image
                src="/assets/logo/logo.png"
                width={120}
                height={40}
                alt="AH Auctions Logo"
                priority
              />
            </Box>
          </NextLink>

          {/* ===================== */}
          {/* CENTER SECTION - SEARCH & NAVIGATION */}
          {/* ===================== */}
          <HStack
            as="nav"
            spacing={6}
            display={{ base: "none", lg: "flex" }}
            color={textColor}
            fontWeight="medium"
            flex={1}
            mx={8}
          >
            {/* Search Bar */}
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search vehicles, VIN, lot numbers..." 
                bg="gray.50"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <InputRightElement width="4.5rem">
                <Button 
                  h="1.75rem" 
                  size="sm" 
                  colorScheme="red"
                  fontSize="xs"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* Navigation Links */}
            <HStack spacing={4}>
              {/* Auctions Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<ChevronDownIcon />}
                  color={textColor}
                  _hover={{ color: "red.500", bg: "red.50" }}
                  _expanded={{ color: "red.500", bg: "red.50" }}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  Inventory
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaCar />} as={NextLink} href="/vehicles?vehicle_type=automobile">
                    Cars & SUVs
                  </MenuItem>
                  <MenuItem icon={<FaTruck />} as={NextLink} href="/vehicles?vehicle_type=trucks">
                    Trucks & Vans
                  </MenuItem>
                  <MenuItem icon={<FaMotorcycle />} as={NextLink} href="/vehicles?vehicle_type=motorcycle">
                    Motorcycles
                  </MenuItem>
                  <MenuItem icon={<FaShip />} as={NextLink} href="/vehicles?vehicle_type=heavy">
                    Heavy Equipment
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* Services */}
              <Link
                as={NextLink}
                href="/services"
                _hover={{ color: "red.500" }}
                transition="color 0.2s"
                fontSize="sm"
                fontWeight="semibold"
              >
                Services
              </Link>

              {/* How It Works */}
              <Link
                as={NextLink}
                href="/how-it-works"
                _hover={{ color: "red.500" }}
                transition="color 0.2s"
                fontSize="sm"
                fontWeight="semibold"
              >
                FAQ
              </Link>
            </HStack>
          </HStack>

          {/* ===================== */}
          {/* RIGHT SECTION - USER ACTIONS */}
          {/* ===================== */}
          <HStack spacing={3} display={{ base: "none", md: "flex" }}>
            {/* Language/Location */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                leftIcon={<FaGlobe />}
                color={textColor}
                _hover={{ color: "red.500" }}
              >
                EN
              </MenuButton>
              <MenuList>
                <MenuItem>English</MenuItem>
                <MenuItem>Japanese</MenuItem>
                <MenuItem>Spanish</MenuItem>
              </MenuList>
            </Menu>

            {/* Watchlist */}
            <IconButton
              aria-label="Watchlist"
              icon={<FiHeart />}
              variant="ghost"
              color={textColor}
              _hover={{ color: "red.500" }}
              size="sm"
            />

            {/* Notifications */}
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              color={textColor}
              _hover={{ color: "red.500" }}
              size="sm"
            />

            {/* User Account */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                leftIcon={<FaUserCircle />}
                color={textColor}
                _hover={{ color: "red.500" }}
              >
                Account
              </MenuButton>
              <MenuList>
                <MenuItem>My Bids</MenuItem>
                <MenuItem>Watchlist</MenuItem>
                <MenuItem>Purchase History</MenuItem>
                <Divider />
                <MenuItem>Sign In</MenuItem>
                <MenuItem>Register</MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* ===================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ===================== */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ lg: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            color={textColor}
            _hover={{ color: "red.500" }}
          />
        </Flex>
      </Container>

      {/* ===================== */}
      {/* MOBILE MENU */}
      {/* ===================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              bg={bgColor}
              borderTop="1px"
              borderColor={borderColor}
              display={{ lg: "none" }}
            >
              <Container maxW="7xl" py={4}>
                <Stack spacing={4}>
                  {/* Mobile Search */}
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      placeholder="Search vehicles..." 
                      bg="gray.50"
                      borderColor="gray.300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>

                  {/* Mobile Search Button */}
                  <Button
                    colorScheme="red"
                    size="sm"
                    leftIcon={<SearchIcon />}
                    onClick={handleSearch}
                  >
                    Search Vehicles
                  </Button>

                  {/* Mobile Navigation Links */}
                  <Stack spacing={3}>
                    <Link
                      as={NextLink}
                      href="/vehicles"
                      fontWeight="semibold"
                      py={2}
                      borderBottom="1px"
                      borderColor="gray.100"
                      onClick={onClose}
                    >
                      All Vehicles
                    </Link>

                    <Stack spacing={2} pl={4}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                        VEHICLE TYPES
                      </Text>
                      <Link as={NextLink} href="/vehicles?vehicle_type=automobile" onClick={onClose}>
                        Cars & SUVs
                      </Link>
                      <Link as={NextLink} href="/vehicles?vehicle_type=trucks" onClick={onClose}>
                        Trucks & Vans
                      </Link>
                      <Link as={NextLink} href="/vehicles?vehicle_type=motorcycle" onClick={onClose}>
                        Motorcycles
                      </Link>
                    </Stack>

                    <Link as={NextLink} href="/services" onClick={onClose}>
                      Services
                    </Link>
                    <Link as={NextLink} href="/how-it-works" onClick={onClose}>
                      FAQ
                    </Link>
                    <Link as={NextLink} href="/about" onClick={onClose}>
                      About Us
                    </Link>

                    {/* Mobile Action Buttons */}
                    <HStack spacing={2} pt={2}>
                      <Button
                        colorScheme="red"
                        size="sm"
                        flex={1}
                        onClick={onClose}
                      >
                        Place Bid
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        flex={1}
                        leftIcon={<FaUserCircle />}
                        onClick={onClose}
                      >
                        Sign In
                      </Button>
                    </HStack>
                  </Stack>
                </Stack>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}