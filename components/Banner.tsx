"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Select,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  Stack,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  VStack,
  Flex,
  Icon,
  Badge,
  SimpleGrid,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useMakeStore } from "../stores/useMakeStore";
import { useModelStore } from "../stores/useModelStore";
import { useVehicleStore } from "../stores/useVehicleStore";
import { useFuelTypeStore } from "../stores/useFuelTypeStore";
import { FiSearch, FiCamera, FiCalendar, FiDroplet, FiFilter, FiChevronLeft, FiChevronRight, FiUser, FiShoppingCart, FiAward } from "react-icons/fi";

const MotionBox = motion(Box);

export default function Banner() {
  const router = useRouter();
  const { makes, loading: makeLoading, fetchMakes } = useMakeStore();
  const { models, fetchModels, setModels } = useModelStore();
  const { getVehicles } = useVehicleStore();
  const { fuelTypes, loading: fuelLoading, fetchFuelTypes } = useFuelTypeStore();

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bgOverlay = useColorModeValue("rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)");

  // Slider data - Copart-style with AH Auctions branding
  const slides = [
    {
      id: 1,
      title: "100% Online Auto Auctions",
      subtitle: "Over 4+ Million Used, Wholesale and Repairable Cars, Trucks & SUVs sold per year!",
      steps: [
        {
          number: "1",
          icon: FiUser,
          title: "Register",
          description: "Sign up for a AH Auctions Basic or Premier Membership."
        },
        {
          number: "2",
          icon: FiSearch,
          title: "Find",
          description: "Search our inventory of more than 390,000+ used & repairable vehicles."
        },
        {
          number: "3",
          icon: FiAward,
          title: "Bid",
          description: "Bid on daily auto auctions Monday–Friday."
        }
      ],
      image: "/assets/images/banner2.png",
      badge: "LIVE AUCTIONS",
      badgeColor: "red",
      ctaText: "Register & Start Bidding",
      ctaSubtext: "No License Required • Global Shipping"
    },
    {
      id: 2,
      title: "Clean Title Vehicles",
      subtitle: "Thousands of accident-free vehicles with verified history reports",
      steps: [
        {
          number: "1",
          icon: FiSearch,
          title: "Search",
          description: "Filter by clean title status and verified condition"
        },
        {
          number: "2",
          icon: FiShoppingCart,
          title: "Inspect",
          description: "View detailed photos and condition reports"
        },
        {
          number: "3",
          icon: FiAward,
          title: "Buy",
          description: "Secure your vehicle with buyer protection"
        }
      ],
      image: "/assets/images/suvs.png",
      badge: "CLEAN TITLE",
      badgeColor: "green",
      ctaText: "Browse Clean Title Vehicles",
      ctaSubtext: "No Hidden Damage • Full History Reports"
    },
    {
      id: 3,
      title: "Runs & Drives Guaranteed",
      subtitle: "All vehicles tested and verified to run and drive perfectly",
      steps: [
        {
          number: "1",
          icon: FiSearch,
          title: "Tested",
          description: "Every vehicle undergoes mechanical inspection"
        },
        {
          number: "2",
          icon: FiShoppingCart,
          title: "Verified",
          description: "Running condition confirmed by our experts"
        },
        {
          number: "3",
          icon: FiAward,
          title: "Drive Away",
          description: "Ready to use immediately after purchase"
        }
      ],
      image: "/assets/images/banner.png",
      badge: "RUNS & DRIVES",
      badgeColor: "blue",
      ctaText: "View Running Vehicles",
      ctaSubtext: "Mechanically Verified • Ready to Drive"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch Makes & Fuel Types on mount
  useEffect(() => {
    if (makes.length === 0) fetchMakes();
    if (fuelTypes.length === 0) fetchFuelTypes();
  }, [fetchMakes, makes.length, fetchFuelTypes, fuelTypes.length]);

  // Handle make change → fetch models
  const handleMakeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const makeName = e.target.value;
    setSelectedMake(makeName);
    setSelectedModel("");
    setModels([]);

    if (makeName) {
      setIsFetchingModels(true);
      const make = makes.find((m) => m.make_name === makeName);
      if (make) {
        await fetchModels(makeName);
      }
      setIsFetchingModels(false);
    } else {
      setIsFetchingModels(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    const filters = {
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      year: selectedYear || undefined,
      fuel_type: selectedFuelType || undefined,
    };

    await getVehicles(filters);

    const queryParams = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    router.push(`/vehicles?${queryParams}`);
  };

  // Slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box
      as="section"
      position="relative"
      bg="linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)"
      bgSize="cover"
      bgPosition="center"
      minH="55vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderBottom="3px solid"
      borderColor="red.500"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        w: "100%",
        h: "100%",
        bg: bgOverlay,
        zIndex: 1,
      }}
    >
      {/* Main Slider */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={1}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentSlide}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            bg={`url('${slides[currentSlide].image}')`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="linear-gradient(90deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.75) 50%, rgba(74, 85, 104, 0.65) 100%)"
          zIndex={2}
        />
      </Box>

      <Container maxW="8xl" zIndex={3} position="relative">
        <Flex direction={{ base: "column", lg: "row" }} align="center" gap={12}>
          {/* Left Content - Text & Steps */}
          <Box flex={1} color="white" textAlign={{ base: "center", lg: "left" }}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <Badge 
                colorScheme={slides[currentSlide].badgeColor} 
                fontSize="md" 
                px={4} 
                py={2} 
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={6}
              >
                {slides[currentSlide].badge}
              </Badge>

              {/* Main Title */}
              <Heading as="h1" size="3xl" fontWeight="bold" lineHeight="1.2" mb={4}>
                {slides[currentSlide].title}
              </Heading>

              {/* Subtitle */}
              <Text fontSize="xl" opacity={0.9} mb={8} maxW="2xl">
                {slides[currentSlide].subtitle}
              </Text>

              {/* Steps */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                {slides[currentSlide].steps.map((step, index) => (
                  <VStack key={index} spacing={3} align={{ base: "center", lg: "start" }}>
                    <HStack spacing={3}>
                      <Flex
                        w="40px"
                        h="40px"
                        bg="red.500"
                        color="white"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        {step.number}
                      </Flex>
                      <Icon as={step.icon} boxSize={6} color="red.300" />
                    </HStack>
                    <VStack spacing={1} align={{ base: "center", lg: "start" }}>
                      <Text fontSize="lg" fontWeight="bold">
                        {step.title}
                      </Text>
                      <Text fontSize="sm" opacity={0.8} textAlign={{ base: "center", lg: "left" }}>
                        {step.description}
                      </Text>
                    </VStack>
                  </VStack>
                ))}
              </SimpleGrid>

              {/* CTA Section */}
              <VStack spacing={3} align={{ base: "center", lg: "start" }}>
                <Button
                  colorScheme="red"
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "2xl",
                  }}
                  transition="all 0.3s"
                >
                  {slides[currentSlide].ctaText}
                </Button>
                <Text fontSize="sm" opacity={0.8} fontStyle="italic">
                  {slides[currentSlide].ctaSubtext}
                </Text>
              </VStack>
            </MotionBox>
          </Box>

          {/* Right Content - Search Form */}
          <Box flex={{ base: "1", lg: "0.8" }} minW={{ lg: "500px" }}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box
                bg="white"
                color="gray.800"
                rounded="xl"
                boxShadow="2xl"
                p={8}
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="lg" color="gray.800" textAlign="center">
                    Find Your Vehicle
                  </Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Make */}
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        MAKE
                      </FormLabel>
                      <Select
                        placeholder={makeLoading ? "Loading makes..." : "All Makes"}
                        value={selectedMake}
                        onChange={handleMakeChange}
                        isDisabled={makeLoading}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                        size="md"
                      >
                        {makes.map((make) => (
                          <option key={make.make_id} value={make.make_name}>
                            {make.make_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Model */}
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        MODEL
                      </FormLabel>
                      <Select
                        placeholder={isFetchingModels ? "Loading models..." : "All Models"}
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        isDisabled={isFetchingModels || !selectedMake}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                        size="md"
                      >
                        {models.map((model) => (
                          <option key={model.model_id} value={model.model_name}>
                            {model.model_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Year */}
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        YEAR
                      </FormLabel>
                      <Select
                        placeholder="All Years"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                        size="md"
                      >
                        {Array.from({ length: 30 }, (_, i) => {
                          const year = 2025 - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>

                    {/* Fuel Type */}
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        FUEL TYPE
                      </FormLabel>
                      <Select
                        placeholder={fuelLoading ? "Loading..." : "All Fuel Types"}
                        value={selectedFuelType}
                        onChange={(e) => setSelectedFuelType(e.target.value)}
                        isDisabled={fuelLoading}
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
                        size="md"
                      >
                        {fuelTypes.map((fuel) => (
                          <option key={fuel.id} value={fuel.name}>
                            {fuel.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <Button
                    colorScheme="red"
                    size="lg"
                    w="full"
                    leftIcon={<Icon as={FiSearch} />}
                    onClick={handleSearch}
                    fontWeight="bold"
                    py={6}
                    mt={4}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s"
                  >
                    Search Vehicles
                  </Button>
                </VStack>
              </Box>
            </MotionBox>
          </Box>
        </Flex>

        {/* Slider Controls */}
        <Flex justify="center" align="center" mt={12} gap={6}>
          {/* Previous Button */}
          <IconButton
            aria-label="Previous slide"
            icon={<FiChevronLeft />}
            color="white"
            bg="blackAlpha.400"
            _hover={{ bg: "blackAlpha.600" }}
            onClick={prevSlide}
            size="lg"
            rounded="full"
          />

          {/* Slide Indicators */}
          <HStack spacing={3}>
            {slides.map((_, index) => (
              <Box
                key={index}
                w={3}
                h={3}
                borderRadius="full"
                bg={currentSlide === index ? "red.500" : "whiteAlpha.500"}
                cursor="pointer"
                onClick={() => goToSlide(index)}
                _hover={{ bg: currentSlide === index ? "red.600" : "whiteAlpha.700" }}
                transition="all 0.2s"
              />
            ))}
          </HStack>

          {/* Next Button */}
          <IconButton
            aria-label="Next slide"
            icon={<FiChevronRight />}
            color="white"
            bg="blackAlpha.400"
            _hover={{ bg: "blackAlpha.600" }}
            onClick={nextSlide}
            size="lg"
            rounded="full"
          />
        </Flex>
      </Container>
    </Box>
  );
}