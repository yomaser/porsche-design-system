import React from "react"
import {Link} from "react-router-dom"
import styles from "./home.module.scss"
import {Button} from "@porsche/ui-kit-react"
import {Flex, Spacing, Text, Grid} from "@porscheui/porsche-ui-kit"

export const Home: React.FunctionComponent = () => {
  return (
    <React.Fragment>

      <header className={styles.teaser}>
        <div className={styles.cover}>
          <video src={require("./assets/porsche-ui-kit.mp4")} autoPlay muted/>
        </div>
      </header>

      <article className={styles.intro}>
        <Grid>
          <Grid.Child size={{base: 12, m: 4}}>
            <Text as="h1" type="2-bold">Porsche UI Kit</Text>
            <Text as="h2" type="4-regular">Design System</Text>
          </Grid.Child>
          <Grid.Child size={{base: 12, m: 8}} className="p-mt--24 p-mt--0-m">
            <Text type="3-regular">The Porsche UI Kit provides the fundamental elements to easily build aesthetic,
              qualitative and intuitive designs. Ready to use as designed Sketch libraries, coded React components or HTML
              with CSS styles. Everything built and tested following the Porsche quality standards and corporate
              design.</Text>
            <Spacing marginTop={16}>
              <Flex gap={16} wrap={true}>
                <Flex.Item>
                  <Spacing marginTop={16}>
                    <Button type="highlight" as={Link} {...{to: "/design/introduction"}}>Start designing</Button>
                  </Spacing>
                </Flex.Item>
                <Flex.Item>
                  <Spacing marginTop={16}>
                    <Button type="highlight" as={Link} {...{to: "/code/introduction"}}>Start coding</Button>
                  </Spacing>
                </Flex.Item>
              </Flex>
            </Spacing>
          </Grid.Child>
        </Grid>
      </article>

      <article className={styles.newsletter}>
        <Grid>
          <Grid.Child size={{base: 12, m: 3}}>
            <Text as="h2" type="2-bold">Always stay informed</Text>
          </Grid.Child>
          <Grid.Child size={{base: 12, m: 8}} offset={{base: 0, m: 1}} className="p-mt--24 p-mt--0-m">
            <Text type="3-regular">Join our mailing list and get informed about Porsche UI.</Text>
            <Spacing marginTop={8}>
              <Text>
                <a href="http://eepurl.com/ghVSjH" target="_blank">Subscribe to mailing list</a>
              </Text>
            </Spacing>
          </Grid.Child>
        </Grid>
      </article>

    </React.Fragment>
  )
}
