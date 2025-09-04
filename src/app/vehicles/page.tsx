"use client";

import { useEffect, useState, useRef } from "react";
import { useVehicleStore } from "../../../stores/useVehicleStore";
import { useMakeStore } from "../../../stores/useMakeStore";
import { useModelStore } from "../../../stores/useModelStore";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Grid,
  HStack,
  VStack,
  Input,
  Select,
  Button,
  Text,
  Heading,
  Flex,
  useBreakpointValue,
  Skeleton,
  SkeletonText,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  NumberInput,
  NumberInputField,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useExchangeRate } from "../../../hooks/useExchangeRate";

export default function VehicleListing() {
  const {
    vehicles,
    currentPage,
    totalPages,
    total,
    setPage,
    searchVehicles,
    loading,
  } = useVehicleStore();

  const { makes: allMakes, fetchMakes, loading: makeLoading } = useMakeStore();
  const { models: allModels, fetchModels } = useModelStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchText, setSearchText] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterYear, setFilterYear] = useState<string | null>(null);

  const [minYear, setMinYear] = useState<number | undefined>(undefined);
  const [maxYear, setMaxYear] = useState<number | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 100000]);
  const [sortBy, setSortBy] = useState<string>("");

  const { rate, loadingP } = useExchangeRate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const hasMounted = useRef(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  // ----------------------
  // Initial Fetch
  // ----------------------
  useEffect(() => {
    searchVehicles({ page: 1 });
    hasMounted.current = true;
  }, []);

  // Fetch makes
  useEffect(() => {
    if (allMakes.length === 0) fetchMakes();
  }, [allMakes.length, fetchMakes]);

  // Fetch models when make changes
  useEffect(() => {
    const fetchModelsForMake = async () => {
      if (filterMake) {
        setIsFetchingModels(true);
        await fetchModels(filterMake);
        setIsFetchingModels(false);
      }
    };
    fetchModelsForMake();
  }, [filterMake, fetchModels]);

  // ----------------------
  // Debounced search/filter effect
  // ----------------------
  useEffect(() => {
    if (!hasMounted.current) return;

    const delayDebounce = setTimeout(() => {
      searchVehicles({
        query: searchText || undefined,
        make: filterMake || undefined,
        model: filterModel || undefined,
        year: filterYear || undefined,
        minYear: minYear || undefined,
        maxYear: maxYear || undefined,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] || undefined,
        sort: sortBy || undefined,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText, filterMake, filterModel, filterYear, minYear, maxYear, priceRange, sortBy]);

  // ----------------------
  // Skeleton Loader
  // ----------------------
  const VehicleSkeleton = () => (
    <Box bg="white" borderRadius="xl" shadow="md" overflow="hidden">
      <Skeleton height="200px" />
      <Box p={4}>
        <Skeleton height="20px" width="70%" mb={3} />
        <SkeletonText noOfLines={2} spacing={2} />
        <HStack spacing={4} mt={4}>
          <Skeleton height="14px" width="40px" />
          <Skeleton height="14px" width="50px" />
          <Skeleton height="14px" width="60px" />
        </HStack>
      </Box>
    </Box>
  );

  // ----------------------
  // Sidebar Filters JSX
  // ----------------------
  const SidebarFilters = (
    <VStack align="stretch" spacing={5}>
      {/* Sort */}
      <Box>
        <Heading size="sm" mb={3}>Sort By</Heading>
        <Select placeholder="Select sorting" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="price_low_high">Price: Low → High</option>
          <option value="price_high_low">Price: High → Low</option>
          <option value="popularity">Popularity</option>
        </Select>
      </Box>

      <Divider />

      {/* Make */}
      <Box>
        <Heading size="sm" mb={3}>Make</Heading>
        <Select
          placeholder={makeLoading ? "Loading makes..." : "Choose Make"}
          value={filterMake}
          onChange={(e) => {
            const makeName = e.target.value;
            setFilterMake(makeName);
            setFilterModel("");
            setFilterYear(null);
          }}
        >
          {allMakes.map((make) => (
            <option key={make.make_id} value={make.make_name}>
              {make.make_name}
            </option>
          ))}
        </Select>
      </Box>

      {/* Model */}
      <Box>
        <Heading size="sm" mb={3}>Model</Heading>
        <Select
          placeholder={isFetchingModels ? "Loading models..." : filterMake ? "Any model" : "Choose make first"}
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
          disabled={!filterMake || isFetchingModels}
        >
          {allModels.map((model) => (
            <option key={model.model_id} value={model.model_name}>
              {model.model_name}
            </option>
          ))}
        </Select>
      </Box>

      <Divider />

      {/* Year Range */}
      <Box>
        <Heading size="sm" mb={3}>Year Range</Heading>
        <HStack>
          <NumberInput
            value={minYear ?? ""}
            min={1990}
            max={maxYear ?? new Date().getFullYear()}
            onChange={(_, n) => setMinYear(Number.isNaN(n) ? undefined : n)}
            w="50%"
          >
            <NumberInputField placeholder="Min Year" />
          </NumberInput>
          <NumberInput
            value={maxYear ?? ""}
            min={minYear ?? 1990}
            max={new Date().getFullYear()}
            onChange={(_, n) => setMaxYear(Number.isNaN(n) ? undefined : n)}
            w="50%"
          >
            <NumberInputField placeholder="Max Year" />
          </NumberInput>
        </HStack>
      </Box>

      {/* Price Range */}
      <Box>
        <Heading size="sm" mb={1}>Price Range</Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </Text>
        <RangeSlider
          aria-label={["min", "max"]}
          min={0}
          max={200000}
          step={500}
          value={priceRange}
          onChange={(val) => setPriceRange([val[0], val[1]] as [number, number])}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>

      {/* Apply / Reset */}
      <Button
        colorScheme="blue"
        onClick={() => {
          searchVehicles({ ...getCurrentFilters(), page: 1 });
          if (isMobile) onClose();
        }}
      >
        Apply Filters
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setFilterMake("");
          setFilterModel("");
          setFilterYear(null);
          setMinYear(undefined);
          setMaxYear(undefined);
          setPriceRange([1000, 100000]);
          setSortBy("");
          setSearchText("");
          searchVehicles({ page: 1 });
          if (isMobile) onClose();
        }}
      >
        Reset All
      </Button>
    </VStack>
  );

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Banner + Filters */}
      <Box
        as="section"
        bgGradient='linear(to-r, red, pink.200)'
        bgSize="cover"
        bgPos="center"
        position="relative"
        py={16}
      >
        <Box position="relative" zIndex={2} textAlign="center">
          <Heading size="2xl" color="white" fontWeight="bold">
            {total} Cars Available
          </Heading>
        </Box>

        <Flex
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
          bg="whiteAlpha.900"
          maxW="7xl"
          mx="auto"
          mt={8}
          p={4}
          borderRadius="xl"
          justify="center"
          gap={3}
        >
          <Input
            placeholder="Search cars..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            flex={{ base: "1 1 100%", md: "1 1 50px" }}
          />
          <Select
            placeholder={makeLoading ? "Loading makes..." : "Choose Make"}
            value={filterMake}
            onChange={(e) => {
              setFilterMake(e.target.value);
              setFilterModel("");
              setFilterYear(null);
            }}
            flex={{ base: "1 1 100%", md: "1 1 50px" }}
          >
            {allMakes.map((make) => (
              <option key={make.make_id} value={make.make_name}>
                {make.make_name}
              </option>
            ))}
          </Select>
          <Select
            placeholder={isFetchingModels ? "Loading models..." : filterMake ? "Any model" : "Choose make first"}
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            disabled={!filterMake || isFetchingModels}
            flex={{ base: "1 1 100%", md: "1 1 30px" }}
          >
            {allModels.map((model) => (
              <option key={model.model_id} value={model.model_name}>
                {model.model_name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Choose Year"
            value={filterYear ?? ""}
            onChange={(e) => setFilterYear(e.target.value)}
            flex={{ base: "1 1 100%", md: "1 1 30px" }}
          >
            {Array.from(new Set(vehicles.map((v) => v.year)))
              .sort((a, b) => b - a)
              .map((year) => <option key={year} value={year}>{year}</option>)}
          </Select>

          {(filterMake || filterModel || filterYear || searchText) && (
            <Button
              colorScheme="gray"
              flex={{ base: "1 1 100%", md: "1 1 120px" }}
              onClick={() => {
                setFilterMake("");
                setFilterModel("");
                setFilterYear(null);
                setSearchText("");
                setMinYear(undefined);
                setMaxYear(undefined);
                setPriceRange([1000, 100000]);
                setSortBy("");
                searchVehicles({ page: 1 });
              }}
            >
              Reset
            </Button>
          )}
        </Flex>
      </Box>

      {/* Main content with sidebar */}
      <Flex maxW="7xl" mx="auto" px={4} py={10} gap={6}>
        {/* Sidebar Desktop */}
        <Box
          w={{ base: "0", md: "290px" }}
          flexShrink={0}
          display={{ base: "none", md: "block" }}
          bg="white"
          shadow="md"
          p={5}
          borderRadius="xl"
          h="fit-content"
          position="sticky"
          top="20px"
        >
          <Heading size="md" mb={4}>Filters</Heading>
          {SidebarFilters}
        </Box>

        {/* Main Column */}
        <Box flex="1" minW={0}>
          {/* Mobile Filters Bar */}
          <Flex
            mb={5}
            justify="space-between"
            align="center"
            gap={3}
            display={{ base: "flex", md: "none" }}
          >
            <Button onClick={onOpen} variant="outline">
              Filters
              {(filterMake || filterModel || filterYear || sortBy || minYear || maxYear || priceRange[0] !== 1000 || priceRange[1] !== 100000) && (
                <Badge ml={2} colorScheme="blue">●</Badge>
              )}
            </Button>
            <Select
              placeholder="Sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              w="50%"
            >
              <option value="latest">Latest</option>
              <option value="price_low_high">Price: Low → High</option>
              <option value="price_high_low">Price: High → Low</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
            </Select>
          </Flex>

          {/* Vehicle Grid/List */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: viewMode === "grid" ? "repeat(2, 1fr)" : "1fr",
              lg: viewMode === "grid" ? "repeat(3, 1fr)" : "1fr",
            }}
            gap={6}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => <VehicleSkeleton key={idx} />)
              : vehicles.map((vehicle) => (
                  <Box key={vehicle.vehicle_id} bg="white" borderRadius="xl" shadow="md" overflow="hidden">
                    <Box position="relative" w="100%" h="200px">
                      <Image
                        src={vehicle.main_photo?.trim() || "/assets/images/no-image.png"}
                        alt={vehicle.make}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      {vehicle.price && rate && (
                        <Box
                          position="absolute"
                          top={2}
                          left={2}
                          bg="red.500"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontWeight="bold"
                        >
                         $ {( Math.ceil((vehicle.price * rate * 1.1) / 100) * 100 ).toLocaleString()}
                        </Box>
                      )}
                      {loadingP && (
                        <Box
                          position="absolute"
                          top={2}
                          left={2}
                          bg="gray.500"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontWeight="bold"
                        >
                          Loading...
                        </Box>
                      )}
                    </Box>
                    <Box p={4}>
                      <Link href={`/vehicles/${vehicle.vehicle_id}`}>
                        <Heading size="md" mb={2}>{vehicle.make} {vehicle.model}</Heading>
                      </Link>
                      <HStack spacing={4} mb={2}>
                        <Text fontSize="sm" color="gray.600">{vehicle.colour || "N/A"}</Text>
                        <Text fontSize="sm" color="gray.600">{vehicle.year}</Text>
                      </HStack>
                      <Text fontSize="sm" noOfLines={3}>{vehicle.more_info || "No additional details available."}</Text>
                      <HStack spacing={4} mt={4} wrap="wrap">
                        <Text fontSize="xs" color="gray.500">{vehicle.transm || "Auto"}</Text>
                        <Text fontSize="xs" color="gray.500">{vehicle.mileage} {vehicle.mileage_unit}</Text>
                        <Text fontSize="xs" color="gray.500">{vehicle.fuel}</Text>
                      </HStack>
                    </Box>
                  </Box>
                ))}
          </Grid>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Flex justify="center" mt={8} wrap="wrap" px={4} gap={2} align="center">
              <Button
                onClick={() => currentPage > 1 && searchVehicles({ ...getCurrentFilters(), page: currentPage - 1 })}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon />
              </Button>
              {generatePaginationButtons()}
              <Button
                onClick={() => currentPage < totalPages && searchVehicles({ ...getCurrentFilters(), page: currentPage + 1 })}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon />
              </Button>
            </Flex>
          )}

          {!loading && vehicles.length === 0 && (
            <Text textAlign="center" mt={10}>No vehicles found.</Text>
          )}
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>{SidebarFilters}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );

  // ----------------------
  // Helper: current filters for pagination
  // ----------------------
  function getCurrentFilters() {
    return {
      query: searchText || undefined,
      make: filterMake || undefined,
      model: filterModel || undefined,
      year: filterYear || undefined,
      minYear: minYear || undefined,
      maxYear: maxYear || undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      sort: sortBy || undefined,
    };
  }

  // ----------------------
  // Helper: generate pagination buttons with ellipsis
  // ----------------------
  function generatePaginationButtons() {
    const pages = [];
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      start = 1;
      end = Math.min(totalPages, maxVisible);
    } else if (currentPage + half > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(<Button key={1} onClick={() => searchVehicles({ ...getCurrentFilters(), page: 1 })} colorScheme={currentPage === 1 ? "blue" : "gray"}>1</Button>);
      if (start > 2) pages.push(<Text key="start-dots">...</Text>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(<Button key={i} onClick={() => searchVehicles({ ...getCurrentFilters(), page: i })} colorScheme={currentPage === i ? "blue" : "gray"}>{i}</Button>);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<Text key="end-dots">...</Text>);
      pages.push(<Button key={totalPages} onClick={() => searchVehicles({ ...getCurrentFilters(), page: totalPages })} colorScheme={currentPage === totalPages ? "blue" : "gray"}>{totalPages}</Button>);
    }

    return pages;
  }
}
