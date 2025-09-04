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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMakeStore } from "../stores/useMakeStore";
import { useModelStore } from "../stores/useModelStore";
import { useVehicleStore } from "../stores/useVehicleStore";

const MotionBox = motion(Box);

export default function Banner() {
  const router = useRouter();
  const { makes, loading: makeLoading, fetchMakes } = useMakeStore();
  const { models, fetchModels } = useModelStore();
  const { searchVehicles } = useVehicleStore();

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState("");
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  const bgOverlay = useColorModeValue("rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)");

  // Fetch Makes on Mount
  useEffect(() => {
    if (makes.length === 0) fetchMakes();
  }, [fetchMakes, makes.length]);

  // Handle Make Change → Fetch Models
  const handleMakeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const makeId = e.target.value;
    setSelectedMake(makeId);
    setSelectedModel("");

    if (makeId) {
      setIsFetchingModels(true);
      await fetchModels(makeId);
      setIsFetchingModels(false);
    } else {
      setIsFetchingModels(false);
    }
  };

  // Search vehicles and navigate
  const handleSearch = async () => {
    // Call Zustand store search function
    await searchVehicles({
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      // NOTE: You can map selectedMaxPrice to min/max in API if needed
    });

    // Navigate to vehicles page with query params
    const queryParams = new URLSearchParams({
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      max_price: selectedMaxPrice,
    }).toString();

    router.push(`/vehicles?${queryParams}`);
  };

  return (
    <Box
      as="section"
      position="relative"
      bgGradient="linear(to-r, red, pink.200)"
      bgSize="cover"
      bgPosition="center"
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        w: "100%",
        h: "100%",
        bg: bgOverlay,
        zIndex: 0,
      }}
    >
      <MotionBox
        maxW="12xl"
        mx="auto"
        textAlign="center"
        color="white"
        px={6}
        zIndex={1}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Heading as="h1" size="2xl" mb={3}>
          Easily Import Your Dream Car Today
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto" mb={8}>
          Importing your dream car has never been easier. Explore top-quality
          vehicles from trusted dealers and have them delivered right to your
          doorstep.
        </Text>

        {/* Search Form */}
        <Box
          bg="white"
          color="gray.800"
          rounded="2xl"
          boxShadow="xl"
          p={6}
          maxW="12xl"
          mx="auto"
          zIndex={2}
        >
          <Stack
            spacing={{ base: 2, lg: 6 }}
            direction={{ base: "column", lg: "row" }}
            align="flex-end"
            justify="space-between"
            wrap="wrap"
          >
            {/* Car Makes */}
            <FormControl w={{ base: "100%", lg: "15%" }}>
              <FormLabel>Car Make</FormLabel>
              <Select
                placeholder={makeLoading ? "Loading makes..." : "Select Make"}
                value={selectedMake}
                onChange={handleMakeChange}
                isDisabled={makeLoading}
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
              >
                {makes.map((make) => (
                  <option key={make.make_id} value={make.make_name}>
                    {make.make_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Car Models */}
            <FormControl w={{ base: "100%", lg: "15%" }}>
              <FormLabel>Car Model</FormLabel>
              <Select
                placeholder={
                  isFetchingModels ? "Loading models..." : "Select Model"
                }
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                isDisabled={isFetchingModels || !selectedMake}
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
              >
                {models.map((model) => (
                  <option key={model.model_id} value={model.model_id}>
                    {model.model_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Year */}
            <FormControl w={{ base: "100%", lg: "15%" }}>
              <FormLabel>Year</FormLabel>
              <Select
                placeholder="Select Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
              >
                {Array.from({ length: 20 }, (_, i) => {
                  const year = 2025 - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            {/* Max Price */}
            <FormControl w={{ base: "100%", lg: "15%" }}>
              <FormLabel>Max Price</FormLabel>
              <Select
                placeholder="Select Max Price"
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
              >
                <option value="10000">$10k</option>
                <option value="20000">$10k-$20k</option>
                <option value="30000">$20k-$30k</option>
                <option value="40000">$30k-$40k</option>
                <option value="50000">$40k-$50k</option>
                <option value="60000">$50k-$60k</option>
                <option value="70000">$60k-$70k</option>
                <option value="80000">$70k-$80k</option>
                <option value="90000">$80k & Above</option>
              </Select>
            </FormControl>

            {/* Search Button */}
            <FormControl w={{ base: "100%", lg: "15%" }}>
              <FormLabel>&nbsp;</FormLabel>
              <Button
                colorScheme="green"
                size="lg"
                w="full"
                leftIcon={<i className="fa fa-search" />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </FormControl>
          </Stack>
        </Box>
      </MotionBox>
    </Box>
  );
}
