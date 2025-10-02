"use client";

import { useEffect, useState, useRef } from "react";
import { useVehicleStore } from "../../../stores/useVehicleStore";
import { useMakeStore } from "../../../stores/useMakeStore";
import { useModelStore } from "../../../stores/useModelStore";
import { useBodyTypeStore } from "../../../stores/useBodyTypeStore";
import { useFuelTypeStore } from "../../../stores/useFuelTypeStore";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Grid,
  HStack,
  VStack,
  Select,
  Button,
  Text,
  Heading,
  Flex,
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
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Badge,
  Card,
  CardBody,
  Stack,
  SimpleGrid,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { useExchangeRate } from "../../../hooks/useExchangeRate";
import { motion } from "framer-motion";
import React from "react";
import { FiFilter, FiGrid, FiList, FiMapPin, FiCalendar, FiDroplet } from "react-icons/fi";

interface VehicleListingProps {
  serverData: {
    initialVehicles: any[];
    initialPagination: {
      currentPage: number;
      totalPages: number;
      total: number;
    };
    initialMakes: any[];
    initialModels: any[];
    initialBodyTypes: any[];
    initialFuelTypes: any[];
    initialLoading: boolean;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function VehicleListing({ serverData }: VehicleListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // stores
  const vehicleStore = useVehicleStore();
  const makeStore = useMakeStore();
  const modelStore = useModelStore();
  const bodyTypeStore = useBodyTypeStore();
  const fuelTypeStore = useFuelTypeStore();

  // local pagination fallback
  const [localPagination, setLocalPagination] = useState({
    currentPage: serverData.initialPagination.currentPage,
    totalPages: serverData.initialPagination.totalPages,
    total: serverData.initialPagination.total,
  });

  // hydrate stores from SSR
  useEffect(() => {
    if (serverData) {
      vehicleStore.setVehicles(serverData.initialVehicles);
      setLocalPagination(serverData.initialPagination);
      makeStore.setMakes(serverData.initialMakes);
      modelStore.setModels(serverData.initialModels);
      bodyTypeStore.setBodyTypes(serverData.initialBodyTypes);
      fuelTypeStore.setFuelTypes(serverData.initialFuelTypes);
    }
  }, [serverData]);

  const { vehicles, getVehicles, loading } = vehicleStore;
  const { makes: allMakes, fetchMakes, loading: makeLoading } = makeStore;
  const { models: allModels, fetchModels, setModels, loading: modelLoading } = modelStore;
  const { bodyTypes: allBodyTypes, fetchBodyTypes, loading: bodyTypeLoading } = bodyTypeStore;
  const { fuelTypes: allFuelTypes, fetchFuelTypes, loading: fuelTypeLoading } = fuelTypeStore;

  const currentPage = vehicleStore.currentPage || localPagination.currentPage;
  const totalPages = vehicleStore.totalPages || localPagination.totalPages;
  const total = vehicleStore.total || localPagination.total;

  // filters state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchText, setSearchText] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterBodyType, setFilterBodyType] = useState("");
  const [filterFuelType, setFilterFuelType] = useState("");
  const [minYear, setMinYear] = useState<number | undefined>(undefined);
  const [maxYear, setMaxYear] = useState<number | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [vehicleType, setVehicleType] = useState<string>("");

  const [priceTouched, setPriceTouched] = useState(false);
  const [yearTouched, setYearTouched] = useState(false);

  const { rate } = useExchangeRate();
  const hasMounted = useRef(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const isPageChange = useRef(false);

  // ✅ Sync state with URL
  useEffect(() => {
    setSearchText(searchParams.get("query") || "");
    setFilterMake(searchParams.get("make") || "");
    setFilterModel(searchParams.get("model") || "");
    setFilterBodyType(searchParams.get("body_type") || "");
    setFilterFuelType(searchParams.get("fuel_type") || "");
    setSortBy(searchParams.get("sort_by") || "latest");
    setVehicleType(searchParams.get("vehicle_type") || "");

    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    if (minPrice && maxPrice) {
      setPriceRange([+minPrice, +maxPrice]);
      setPriceTouched(true);
    } else {
      setPriceRange([0, 1000000]);
      setPriceTouched(false);
    }

    const minY = searchParams.get("min_year");
    const maxY = searchParams.get("max_year");
    if (minY || maxY) {
      setMinYear(minY ? +minY : undefined);
      setMaxYear(maxY ? +maxY : undefined);
      setYearTouched(true);
    } else {
      setMinYear(undefined);
      setMaxYear(undefined);
      setYearTouched(false);
    }

    hasMounted.current = true;
  }, [searchParams]);

  // build filters object
  const getCurrentFilters = () => {
    const filters: Record<string, any> = {
      query: searchText || undefined,
      make: filterMake || undefined,
      model: filterModel || undefined,
      body_type: filterBodyType || undefined,
      fuel_type: filterFuelType || undefined,
      sort_by: sortBy || undefined,
      vehicle_type: vehicleType || undefined,
    };
    if (yearTouched) {
      if (minYear !== undefined) filters.min_year = minYear;
      if (maxYear !== undefined) filters.max_year = maxYear;
    }
    if (priceTouched) {
      filters.min_price = priceRange[0];
      filters.max_price = priceRange[1];
    }
    return filters;
  };

  // push filters → URL
  const pushToUrl = (page?: number, resetPage = false) => {
    const params = new URLSearchParams();
    const filters = getCurrentFilters();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    const targetPage = resetPage ? 1 : (page || currentPage);
    params.set("page", targetPage.toString());

    if (page && !resetPage) {
      isPageChange.current = true;
    }

    router.push(`/vehicles?${params.toString()}`, { scroll: false });
  };

  // fetch models when make changes
  useEffect(() => {
    const fetchModelsForMake = async () => {
      if (!filterMake) {
        setModels([]);
        setFilterModel("");
        return;
      }
      setModels([]);
      await fetchModels(filterMake);
      if (!allModels.find((m) => m.model_name === filterModel)) {
        setFilterModel("");
      }
    };
    if (hasMounted.current) fetchModelsForMake();
  }, [filterMake, fetchModels]);

  // fetch vehicles when URL changes
  useEffect(() => {
    if (!hasMounted.current) return;
    const fetchVehicles = async () => {
      const filters = getCurrentFilters();
      await getVehicles({ ...filters, page: currentPageFromUrl });
    };
    fetchVehicles();
  }, [searchParams]);

  // debounce filter changes → update URL
  useEffect(() => {
    if (!hasMounted.current) return;
    
    if (isPageChange.current) {
      isPageChange.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      pushToUrl(1);
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [
    searchText,
    filterMake,
    filterModel,
    filterBodyType,
    filterFuelType,
    minYear,
    maxYear,
    priceRange,
    sortBy,
    vehicleType,
  ]);

  // reset filters
  const resetFilters = () => {
    setFilterMake("");
    setFilterModel("");
    setFilterBodyType("");
    setFilterFuelType("");
    setMinYear(undefined);
    setMaxYear(undefined);
    setPriceRange([0, 1000000]);
    setSortBy("latest");
    setSearchText("");
    setVehicleType("");
    setPriceTouched(false);
    setYearTouched(false);
    setModels([]);

    pushToUrl(1, true);
    onClose();
  };

  // skeleton card
  const VehicleSkeleton = () => (
    <Card bg="white" borderRadius="md" shadow="sm" overflow="hidden">
      <Skeleton height="200px" />
      <CardBody p={4}>
        <Skeleton height="20px" width="70%" mb={3} />
        <SkeletonText noOfLines={2} spacing={2} />
      </CardBody>
    </Card>
  );

// sidebar filters
const SidebarFilters = (
  <VStack align="stretch" spacing={6}>
    {/* Search Box */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">SEARCH</Text>
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input 
          placeholder="Search vehicles..." 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          bg="white"
          borderColor="gray.300"
        />
      </InputGroup>
    </Box>

    {/* Sort By */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">SORT BY</Text>
      <Select 
        size="sm" 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        bg="white"
        borderColor="gray.300"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_low_high">Price: Low to High</option>
        <option value="price_high_low">Price: High to Low</option>
      
      </Select>
    </Box>

    <Divider />

    {/* Vehicle Type */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">VEHICLE TYPE</Text>
      <Select 
        size="sm" 
        value={vehicleType} 
        onChange={(e) => setVehicleType(e.target.value)}
        bg="white"
        borderColor="gray.300"
      >
        <option value="">All Types</option>
        <option value="trucks">Trucks</option>
        <option value="automobile">Automobiles</option>
        <option value="suv">SUV</option>
        <option value="motorcycle">Motorcycle</option>
      </Select>
    </Box>

    {/* Make */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">MAKE</Text>
      <Select 
        size="sm" 
        placeholder="All Makes" 
        value={filterMake} 
        onChange={(e) => setFilterMake(e.target.value)}
        bg="white"
        borderColor="gray.300"
      >
        {allMakes.map((make) => (
          <option key={make.make_id} value={make.make_name}>{make.make_name}</option>
        ))}
      </Select>
    </Box>

    {/* Model */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">MODEL</Text>
      <Select 
        size="sm" 
        placeholder={filterMake ? "All Models" : "Select Make First"} 
        value={filterModel} 
        onChange={(e) => setFilterModel(e.target.value)} 
        disabled={!filterMake}
        bg="white"
        borderColor="gray.300"
      >
        {allModels.map((model) => (
          <option key={model.model_id} value={model.model_name}>{model.model_name}</option>
        ))}
      </Select>
    </Box>

    {/* Body Type */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">BODY TYPE</Text>
      <Select 
        size="sm" 
        placeholder="All Body Types" 
        value={filterBodyType} 
        onChange={(e) => setFilterBodyType(e.target.value)}
        bg="white"
        borderColor="gray.300"
      >
        {allBodyTypes.map((bodyType) => (
          <option key={bodyType.body_type_id} value={bodyType.body_type_name}>
            {bodyType.body_type_name}
          </option>
        ))}
      </Select>
    </Box>

    {/* Fuel Type */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">FUEL TYPE</Text>
      <Select 
        size="sm" 
        placeholder="All Fuel Types" 
        value={filterFuelType} 
        onChange={(e) => setFilterFuelType(e.target.value)}
        bg="white"
        borderColor="gray.300"
      >
        {allFuelTypes.map((fuelType) => (
          <option key={fuelType.id} value={fuelType.name}>
            {fuelType.name}
          </option>
        ))}
      </Select>
    </Box>

    {/* Year Range */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">YEAR RANGE</Text>
      <HStack spacing={2}>
        <NumberInput 
          size="sm" 
          value={minYear ?? ""} 
          min={1990} 
          max={maxYear ?? new Date().getFullYear()} 
          onChange={(_, n) => { setMinYear(Number.isNaN(n) ? undefined : n); setYearTouched(true); }}
          bg="white"
          borderColor="gray.300"
        >
          <NumberInputField placeholder="Min" />
        </NumberInput>
        <Text fontSize="sm" color="gray.500">to</Text>
        <NumberInput 
          size="sm" 
          value={maxYear ?? ""} 
          min={minYear ?? 1990} 
          max={new Date().getFullYear()} 
          onChange={(_, n) => { setMaxYear(Number.isNaN(n) ? undefined : n); setYearTouched(true); }}
          bg="white"
          borderColor="gray.300"
        >
          <NumberInputField placeholder="Max" />
        </NumberInput>
      </HStack>
    </Box>

    {/* Price Range */}
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">
        PRICE RANGE: ${(priceRange[0]).toLocaleString()} - ${(priceRange[1]).toLocaleString()}
      </Text>
      <RangeSlider 
        min={0} 
        max={100000} 
        step={1000} 
        value={priceRange} 
        onChange={(val) => { setPriceRange([val[0], val[1]] as [number, number]); setPriceTouched(true); }}
        colorScheme="red"
      >
        <RangeSliderTrack bg="gray.200">
          <RangeSliderFilledTrack bg="red.500" />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} bg="red.500" />
        <RangeSliderThumb index={1} bg="red.500" />
      </RangeSlider>
    </Box>

    <Button 
      colorScheme="red" 
      size="sm" 
      onClick={resetFilters}
      fontWeight="bold"
    >
      RESET ALL FILTERS
    </Button>
  </VStack>
);

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Header Section - Copart Style */}
      <Box as="section" bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="7xl">
          <Breadcrumb fontSize="sm" color="gray.600" mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/vehicles">Vehicle Auction</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg" color="gray.800" fontWeight="bold">
              Showing {vehicles.length} of {total.toLocaleString()} + Search results
            </Heading>
            <HStack spacing={3}>
              <Button 
                size="sm" 
                variant={viewMode === "grid" ? "solid" : "outline"} 
                colorScheme="red"
                onClick={() => setViewMode("grid")}
                leftIcon={<FiGrid />}
              >
                Grid
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "list" ? "solid" : "outline"} 
                colorScheme="red"
                onClick={() => setViewMode("list")}
                leftIcon={<FiList />}
              >
                List
              </Button>
            </HStack>
          </Flex>

          {/* Active Filters Bar */}
          <Flex wrap="wrap" gap={2} mb={4}>
            <Badge colorScheme="red" px={3} py={1} borderRadius="full">
              All Vehicles
            </Badge>
            {filterMake && (
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                Make: {filterMake}
              </Badge>
            )}
            {filterModel && (
              <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                Model: {filterModel}
              </Badge>
            )}
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={6}>
        <Flex gap={6}>
          {/* Sidebar Filters */}
          <Box w="300px" display={{ base: "none", lg: "block" }}>
            <Card shadow="sm" border="1px" borderColor="gray.200">
              <CardBody>
                <Heading size="md" mb={4} color="gray.800">FILTERS</Heading>
                {SidebarFilters}
              </CardBody>
            </Card>
          </Box>

          {/* Vehicles Grid */}
          <Box flex="1" minW={0}>
            {/* Mobile Filter Button */}
            <Box display={{ base: "block", lg: "none" }} mb={4}>
              <Button 
                w="full" 
                colorScheme="red" 
                onClick={onOpen}
                leftIcon={<FiFilter />}
                size="lg"
              >
                FILTERS & SORT
              </Button>
            </Box>

            {/* Results Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <Text color="gray.600" fontSize="sm">
                 Showing {vehicles.length} of {total.toLocaleString()} + Search results
              </Text>
              <Select 
                size="sm" 
                w="auto" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                bg="white"
                borderColor="gray.300"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
               
              </Select>
            </Flex>

            {/* Vehicles Grid/List */}
            {viewMode === "grid" ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => <VehicleSkeleton key={idx} />)
                ) : vehicles.length === 0 ? (
                  <Box gridColumn="1 / -1">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                      <Flex direction="column" align="center" justify="center" py={16} px={4} bg="white" borderRadius="xl" shadow="sm">
                        <Image src="/assets/images/no-results.jpg" alt="No results" width={250} height={200} />
                        <Heading size="lg" mt={6} color="gray.700">No Results Found</Heading>
                        <Text mt={2} color="gray.500" fontSize="md" textAlign="center" maxW="400px">
                          We couldn't find any vehicles matching your filters. Try adjusting your search or resetting filters.
                        </Text>
                        <Button mt={6} colorScheme="red" size="md" onClick={resetFilters}>Reset Filters</Button>
                      </Flex>
                    </motion.div>
                  </Box>
                ) : (
                  vehicles.map((vehicle) => (
                    <Card key={vehicle.vehicle_id} bg="white" shadow="md" border="1px" borderColor="gray.200" overflow="hidden" _hover={{ shadow: "lg", transform: "translateY(-2px)" }} transition="all 0.2s">
                      <Box position="relative">
                        <Box position="relative" w="100%" h="200px">
                          <Skeleton isLoaded={!!vehicle.main_photo} startColor="gray.200" endColor="gray.400" fadeDuration={0.4} w="100%" h="100%">
                            <Image 
                              src={vehicle.main_photo?.trim() || "/assets/images/no-image.png"} 
                              alt={vehicle.make} 
                              fill 
                              style={{ objectFit: "cover" }} 
                            />
                          </Skeleton>
                          {vehicle.price && rate && (
                            <Box position="absolute" top={3} left={3} bg="red.500" color="white" px={3} py={1} borderRadius="md" fontWeight="bold" fontSize="sm">
                              $ {(Math.ceil((vehicle.price_usd * 1.1) / 100) * 100).toLocaleString()}
                            </Box>
                          )}
                          <Badge position="absolute" top={3} right={3} colorScheme="green" borderRadius="full" px={2}>
                            Bid Now
                          </Badge>
                        </Box>
                      </Box>
                      
                      <CardBody p={4}>
                        <Link href={`/vehicles/${vehicle.slug}`}>
                          <Heading size="md" mb={2} color="gray.800" _hover={{ color: "red.500" }}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </Heading>
                        </Link>
                        
                        <Stack spacing={2} mb={3}>
                          <HStack spacing={3} color="gray.600" fontSize="sm">
                            <HStack spacing={1}>
                              <Icon as={FiMapPin} />
                              <Text>Japan</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Icon as={FiCalendar} />
                              <Text>{vehicle.year}</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Icon as={FiDroplet} />
                              <Text>{vehicle.fuel || "N/A"}</Text>
                            </HStack>
                          </HStack>
                          
                          <HStack spacing={4} fontSize="sm" color="gray.600">
                            <Text>{vehicle.mileage?.toLocaleString() || "N/A"} {vehicle.mileage_unit}</Text>
                            <Text>{vehicle.transm || "N/A"}</Text>
                            <Text>{vehicle.colour || "N/A"}</Text>
                          </HStack>
                        </Stack>

                        <Text fontSize="sm" color="gray.600" noOfLines={2} mb={4}>
                          {vehicle.more_info || "No additional details available."}
                        </Text>

                       <Button 
                          w="full" 
                          colorScheme="red" 
                          size="sm" 
                          fontWeight="bold"
                          as={Link}
                          href={`/vehicles/${vehicle.slug}`}
                        >
                          VIEW DETAILS
                        </Button>
                      </CardBody>
                    </Card>
                  ))
                )}
              </SimpleGrid>
            ) : (
              // List View
              <VStack spacing={4} align="stretch">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.vehicle_id} bg="white" shadow="sm" border="1px" borderColor="gray.200" overflow="hidden">
                    <Flex>
                      <Box position="relative" w="200px" flexShrink={0}>
                        <Skeleton isLoaded={!!vehicle.main_photo} startColor="gray.200" endColor="gray.400" fadeDuration={0.4} w="100%" h="100%">
                          <Image 
                            src={vehicle.main_photo?.trim() || "/assets/images/no-image.png"} 
                            alt={vehicle.make} 
                            fill 
                            style={{ objectFit: "cover" }} 
                          />
                        </Skeleton>
                      </Box>
                      
                      <Box flex="1" p={4}>
                        <Flex justify="space-between" align="start" mb={2}>
                          <Link href={`/vehicles/${vehicle.slug}`}>
                            <Heading size="md" color="gray.800" _hover={{ color: "red.500" }}>
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </Heading>
                          </Link>
                          {vehicle.price && rate && (
                            <Text fontSize="xl" fontWeight="bold" color="red.500">
                              $ {(Math.ceil((vehicle.price_usd * 1.1) / 100) * 100).toLocaleString()}
                            </Text>
                          )}
                        </Flex>
                        
                        <HStack spacing={6} mb={3} color="gray.600" fontSize="sm">
                          <HStack spacing={1}>
                            <Icon as={FiCalendar} />
                            <Text>{vehicle.year}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FiDroplet} />
                            <Text>{vehicle.fuel || "N/A"}</Text>
                          </HStack>
                          <Text>{vehicle.mileage?.toLocaleString() || "N/A"} {vehicle.mileage_unit}</Text>
                          <Text>{vehicle.transm || "N/A"}</Text>
                          <Text>{vehicle.colour || "N/A"}</Text>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                          {vehicle.more_info || "No additional details available."}
                        </Text>
                        
                        <Flex justify="space-between" align="center">
                          <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                            Ready for Bidding
                          </Badge>
                          <Button 
                              colorScheme="red" 
                              size="sm" 
                              fontWeight="bold"
                              as={Link}
                              href={`/vehicles/${vehicle.slug}`}
                            >
                              VIEW DETAILS
                            </Button>
                        </Flex>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Flex justify="center" mt={8} wrap="wrap" gap={2} align="center">
                <Button
                  onClick={() => pushToUrl(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="sm"
                  variant="outline"
                  leftIcon={<ChevronLeftIcon />}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages })
                  .map((_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <Text px={2}>...</Text>}
                        <Button
                          onClick={() => pushToUrl(page)}
                          colorScheme={currentPage === page ? "red" : "gray"}
                          variant={currentPage === page ? "solid" : "outline"}
                          size="sm"
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}

                <Button
                  onClick={() => pushToUrl(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  size="sm"
                  variant="outline"
                  rightIcon={<ChevronRightIcon />}
                >
                  Next
                </Button>
              </Flex>
            )}
          </Box>
        </Flex>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">FILTERS & SORT</Text>
              <DrawerCloseButton position="relative" top={0} right={0} />
            </Flex>
          </DrawerHeader>
          <DrawerBody py={4}>
            {SidebarFilters}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}