"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Image,
  Flex,
} from "@chakra-ui/react";

export default function Services() {
  const steps = [
    {
      title: "Search & Select",
      desc: "Explore thousands of vehicles from Japan's top auctions and choose the one that perfectly matches your needs and budget.",
      img: "/assets/images/products/about/employees.png",
    },
    {
      title: "Place Your Bid",
      desc: "We handle the entire bidding process on your behalf, ensuring you get the best possible deal on your chosen vehicle.",
      img: "/assets/images/products/about/megaphone.png",
    },
    {
      title: "Payment & Shipping",
      desc: "Once you win, we manage secure payments, handle all documentation, and organize fast, reliable shipping straight to Kenya.",
      img: "/assets/images/products/about/pencil.png",
    },
    {
      title: "Receive Your Vehicle",
      desc: "Pick up your fully inspected vehicle at the port or have it delivered directly to your doorstep — quick and hassle-free.",
      img: "/assets/images/products/about/coins.png",
    },
  ];

  return (
    <Box bg="gray.50" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        {/* SERVICES SECTION */}
        <Box mb={16} textAlign="justify">
          <Heading as="h2" size="2xl" mb={4} color="gray.800" textAlign="center">
            Our Services
          </Heading>
          <Heading
            as="h4"
            size="md"
            mb={4}
            color="blue.500"
            textAlign="center"
          >
            Seamless Car Importing from Japan to the rest of the world
          </Heading>
          <VStack align="start" spacing={4}>
            <Text fontSize="md" color="gray.600">
              At <strong>AH Auctions</strong>, we make it easy to import your dream vehicle directly
              from Japan. From family-friendly sedans to rugged SUVs and commercial trucks, we give
              you access to Japan’s top auction houses with **thousands of cars listed daily**.
            </Text>
            <Text fontSize="md" color="gray.600">
              Our expert team handles everything — from sourcing and bidding to payments, shipping,
              and customs clearance. We ensure a **smooth, transparent, and stress-free process** so
              you can focus on choosing the perfect car.
            </Text>
            <Text fontSize="md" color="gray.600">
              With **competitive prices, verified vehicle inspections, and reliable delivery**, we’re
              your trusted partner for hassle-free Japanese car imports.
            </Text>
          </VStack>
        </Box>

        {/* HOW IT WORKS */}
        <Box textAlign="center" mb={10}>
          <Heading as="h2" size="xl" color="gray.800" mb={2}>
            How It Works
          </Heading>
          <Text color="gray.500" fontSize="lg">
            Importing your car from Japan has never been this easy
          </Text>
        </Box>

        {/* STEPS GRID */}
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={8}
        >
          {steps.map((step, index) => (
            <Flex
              key={index}
              direction="column"
              align="center"
              textAlign="center"
              bg="white"
              p={6}
              rounded="2xl"
              shadow="md"
              _hover={{
                shadow: "xl",
                transform: "translateY(-8px)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Box
                bg="blue.50"
                p={4}
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
                mb={4}
              >
                <Image
                  src={step.img}
                  alt={step.title}
                  boxSize="60px"
                  objectFit="contain"
                />
              </Box>
              <Heading size="md" color="gray.800" mb={2}>
                {step.title}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {step.desc}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
