import React, { useState } from 'react';
import styled from 'styled-components';

const TabsOuterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const TabsContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
`;

const TabContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  opacity: ${props => (props.active ? 1 : 0)};
  pointer-events: ${props => (props.active ? 'initial' : 'none')};
  transition: opacity 0.2s ease-in-out;
`;
const TabHeaderContainer = styled.div`
  border-bottom: 1px solid gray;
`;
const TabHeader = styled.div`
  display: inline-block;
  padding: 8px 16px;
  cursor: pointer;
  color: ${props => (props.active ? 'black' : 'gray')};
`;

export function Tabs({ defaultTab, children }) {
  const tabs = children.map(child => child.props.name);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

  return (
    <TabsOuterContainer>
      <TabHeaderContainer>
        {tabs.map(tab => (
          <TabHeader
            key={tab}
            onClick={() => setActiveTab(tab)}
            active={tab === activeTab}
          >
            {tab}
          </TabHeader>
        ))}
      </TabHeaderContainer>
      <TabsContainer>
        {children.map(child => {
          if (child.props.name === activeTab) {
            return React.cloneElement(child, { active: true });
          }
          return child;
        })}
      </TabsContainer>
    </TabsOuterContainer>
  );
}
export function Tab({ name, children, active }) {
  return <TabContainer active={active}>{children}</TabContainer>;
}
