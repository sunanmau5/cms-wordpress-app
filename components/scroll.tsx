"use client";

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { motion, Variants } from "framer-motion";

import useWindowsScroll, { Direction } from "@/hooks/use-windows-scroll";

import ScrollNavigation, { ScrollNavigationProps } from "./scroll-navigation";

export type Page = JSX.Element;

export interface PageProps {
  pageName?: string;
}

type NavigationFunction = (_props: ScrollNavigationProps) => JSX.Element;

type NavigationProp = NavigationFunction | boolean;

interface ScrollProps {
  children: Page[];
  navigation?: NavigationProp;
  scrollableIndicator?: boolean;
}

const initialVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: ({ currentPage, scrollableIndicator }) => ({
    opacity: 1,
    y:
      scrollableIndicator && currentPage === 0
        ? ["0%", "-3%", "-3%", "-3%", "0%"]
        : 0,
    transition: {
      opactiy: { duration: 0.8 },
      y: {
        delay: 0.5,
        duration: 0.6,
      },
    },
  }),
  exit: { opacity: 1 },
};

const baseVariants = (direction: Direction, offset: number): Variants => {
  const offsetPx = -offset / 3;
  return {
    initial: {
      y: `${direction === "up" ? "-" : "+"}100%`,
      marginTop: offsetPx,
    },
    animate: {
      y: offsetPx,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 90,
        stiffness: 1000,
      },
    },
    exit: {
      y: `${direction === "up" ? "+" : "-"}100%`,
      marginTop: offsetPx,
    },
  };
};

const initialState = {
  currentPage: 0,
  animating: true,
  realDirection: null as Direction | null,
  destPage: null as number | null,
  isFirstRender: true,
};

type Action =
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_ANIMATING"; payload: boolean }
  | { type: "SET_REAL_DIRECTION"; payload: Direction | null }
  | { type: "SET_DEST_PAGE"; payload: number | null }
  | { type: "SET_IS_FIRST_RENDER"; payload: boolean };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ANIMATING":
      return { ...state, animating: action.payload };
    case "SET_REAL_DIRECTION":
      return { ...state, realDirection: action.payload };
    case "SET_DEST_PAGE":
      return { ...state, destPage: action.payload };
    case "SET_IS_FIRST_RENDER":
      return { ...state, isFirstRender: action.payload };
    default:
      return state;
  }
}

const Scroll = React.memo(function Scroll({
  children,
  navigation = false,
  scrollableIndicator = true,
}: ScrollProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, animating, realDirection, destPage, isFirstRender } =
    state;

  // Custom use window hook
  const { direction, trigger, offset } = useWindowsScroll();

  const mapChild = useCallback(
    (child: Page, key: number) => (
      <div key={key} className="m-0 w-full h-full">
        {child}
      </div>
    ),
    [],
  );

  const childrenWithProps = useMemo(
    () => React.Children.map(children, mapChild),
    [children, mapChild],
  );

  const PreviousPage = childrenWithProps[currentPage - 1];
  const CurrentPage = childrenWithProps[currentPage];
  const NextPage = childrenWithProps[currentPage + 1];
  const pagesCount = children.length;

  const createNavigation = useCallback(
    (
      navigation: NavigationProp,
      props: ScrollNavigationProps,
    ): ReactElement => {
      if (!navigation) return <></>;
      if (navigation === true) return <ScrollNavigation {...props} />;
      return navigation(props);
    },
    [],
  );

  const updatePage = useCallback(
    (page: number | null) => {
      if (page !== null && !animating && page >= 0 && page < pagesCount) {
        dispatch({ type: "SET_CURRENT_PAGE", payload: page });
        dispatch({ type: "SET_ANIMATING", payload: true });
      }
    },
    [animating, pagesCount],
  );

  const handlePageChange = useCallback(
    (direction: Direction) => {
      const newCurrentPage =
        direction === "up" ? currentPage - 1 : currentPage + 1;
      updatePage(newCurrentPage);
    },
    [currentPage, updatePage],
  );

  const forcePageChange = useCallback(
    (page: number) => {
      if (animating || page === currentPage) return;
      dispatch({
        type: "SET_REAL_DIRECTION",
        payload: page < currentPage ? "up" : page > currentPage ? "down" : null,
      });
      dispatch({ type: "SET_DEST_PAGE", payload: page });
    },
    [animating, currentPage],
  );

  const handleForcePageChange = useCallback(() => {
    updatePage(destPage);
    dispatch({ type: "SET_DEST_PAGE", payload: null });
  }, [destPage, updatePage]);

  useEffect(() => {
    dispatch({ type: "SET_REAL_DIRECTION", payload: direction });
  }, [direction]);

  useEffect(() => {
    dispatch({ type: "SET_REAL_DIRECTION", payload: direction });
    if (!animating) handlePageChange(direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (destPage !== null) handleForcePageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destPage]);

  const Navigation = useMemo(
    () =>
      createNavigation(navigation, {
        currentPage,
        forcePageChange,
        pages: children,
      }),
    [navigation, currentPage, forcePageChange, children, createNavigation],
  );

  const memoizedBaseVariants = useMemo(
    () => baseVariants(realDirection, animating ? 0 : offset),
    [realDirection, animating, offset],
  );

  return (
    <>
      {Navigation}
      <motion.div
        key={currentPage}
        animate="animate"
        className="w-full h-screen m-0 p-0 fixed"
        custom={{ currentPage, scrollableIndicator }}
        exit="exit"
        initial="initial"
        onAnimationComplete={() => {
          if (isFirstRender) {
            dispatch({ type: "SET_IS_FIRST_RENDER", payload: false });
          }
          dispatch({ type: "SET_ANIMATING", payload: false });
        }}
        variants={isFirstRender ? initialVariants : memoizedBaseVariants}
      >
        <div className="h-full -mt-[100vh]">{PreviousPage}</div>
        {CurrentPage}
        {NextPage}
      </motion.div>
    </>
  );
});

export default Scroll;
